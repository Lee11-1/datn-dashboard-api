const fs = require('fs').promises;
const fsSync = require('fs');
const os = require('os');
const path = require('path');
const nodemailer = require('nodemailer');

const LOCK_DIR = path.join(os.tmpdir(), 'email_service_locks');

/**
 * Email Worker - Executes email sending tasks in a separate process
 * Handles locking to prevent duplicate sends
 */

async function ensureLockDir() {
  try {
    await fs.mkdir(LOCK_DIR, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
}

async function obtainEmailLock(emailId) {
  await ensureLockDir();
  const lockPath = path.join(LOCK_DIR, `${emailId}.lock`);
  try {
    const fh = await fs.open(lockPath, 'wx');
    await fh.write(String(process.pid));
    await fh.close();
    return lockPath;
  } catch (err) {
    return null; // Lock already exists
  }
}

async function releaseLock(lockPath) {
  try {
    if (lockPath) await fs.unlink(lockPath);
  } catch (e) {
    // Ignore cleanup errors
  }
}

/**
 * Parse job data from environment or command line
 */
function getJobData() {
  try {
    // Try to get from environment first
    if (process.env.JOB_DATA) {
      return JSON.parse(process.env.JOB_DATA);
    }
    // Fallback to command line argument
    if (process.argv[2]) {
      return JSON.parse(process.argv[2]);
    }
  } catch (err) {
    console.error('[EmailWorker] Failed to parse job data:', err.message);
  }
  return null;
}

/**
 * Get SMTP configuration from environment
 */
function getSmtpConfig() {
  return {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || ''
    }
  };
}

/**
 * Send email using nodemailer
 */
async function sendEmail(jobData, smtpConfig) {
  try {
    const transporter = nodemailer.createTransport(smtpConfig);

    const mailOptions = {
      from: jobData.from || smtpConfig.auth.user || 'noreply@system.com',
      to: jobData.to,
      subject: jobData.subject,
      html: jobData.html,
      text: jobData.text || (jobData.html ? jobData.html.replace(/<[^>]*>/g, '') : '')
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`[EmailWorker] Email sent to ${jobData.to}:`, result.messageId);

    return {
      success: true,
      emailId: jobData.emailId,
      messageId: result.messageId,
      sentAt: new Date().toISOString()
    };
  } catch (err) {
    console.error(`[EmailWorker] Error sending email: ${err.message}`);
    throw err;
  }
}

/**
 * Main worker execution
 */
async function run() {
  const jobData = getJobData();

  if (!jobData) {
    console.error('[EmailWorker] No job data provided');
    process.exit(1);
  }

  const emailId = jobData.emailId || `email-${Date.now()}`;
  const lockPath = await obtainEmailLock(emailId);

  if (!lockPath) {
    console.log(`[EmailWorker] Email ${emailId} is already being processed, exiting.`);
    process.exit(0);
  }

  try {
    const smtpConfig = getSmtpConfig();
    
    if (!smtpConfig.auth.user || !smtpConfig.auth.pass) {
      throw new Error('SMTP credentials not configured in environment variables');
    }

    const result = await sendEmail(jobData, smtpConfig);
    console.log('[EmailWorker] Task completed:', JSON.stringify(result));
    
  } catch (err) {
    const errorMsg = err && err.message ? err.message : String(err);
    console.error('[EmailWorker] Task failed:', errorMsg);
    
    // Log retry information if applicable
    const retryCount = jobData.retryCount || 0;
    const maxRetries = 3;
    if (retryCount < maxRetries) {
      console.log(`[EmailWorker] Will retry (attempt ${retryCount + 1}/${maxRetries})`);
    }
  } finally {
    await releaseLock(lockPath);
    process.exit(0);
  }
}

if (require.main === module) {
  run();
}

module.exports = { sendEmail, getSmtpConfig, getJobData };
