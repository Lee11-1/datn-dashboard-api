
const EmailService = require('./service/emailService');

const smtpConfig = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || 'your-email@gmail.com',
    pass: process.env.SMTP_PASS || 'your-app-password'
  }
};

const emailService = new EmailService(smtpConfig);
emailService.start(); // Start processing queued emails every 30 seconds

/**
 * 2. Queue single email
 */
async function sendWelcomeEmail(userEmail, userName) {
  const emailId = await emailService.queueEmail({
    to: userEmail,
    subject: 'Welcome to Our Platform',
    html: `
      <h1>Hello ${userName}!</h1>
      <p>Welcome to our platform. We're excited to have you on board.</p>
    `,
    text: `Hello ${userName}!\n\nWelcome to our platform. We're excited to have you on board.`
  });
  return emailId;
}

/**
 * 3. Send email immediately (outside queue)
 */
async function sendUrgentEmail(to, subject, html) {
  return emailService.sendEmailDirect({
    to,
    subject,
    html
  });
}

/**
 * 4. Batch queue emails
 */
async function notifyMultipleUsers(users) {
  const emailList = users.map(user => ({
    to: user.email,
    subject: 'Important Notification',
    html: `<p>Hello ${user.name},</p><p>${user.message}</p>`,
    text: `Hello ${user.name},\n\n${user.message}`
  }));

  await emailService.queueEmailBatch(emailList);
}

/**
 * 5. Monitor email queue
 */
function checkEmailStatus() {
  const status = emailService.getQueueStatus();
  console.log('Email Service Status:', {
    queuedEmails: status.queuedEmails,
    activeWorkers: status.activeWorkers,
    taskName: status.taskName,
    lastExecution: status.lastExecutionTime
  });
  
  // See queued email details
  if (status.emailQueueDetails.length > 0) {
    console.log('Pending Emails:', status.emailQueueDetails);
  }
}

/**
 * 6. Stop email service gracefully
 */
function stopEmailService() {
  emailService.stop();
}

/**
 * 7. Update SMTP configuration dynamically
 */
function updateEmailConfig(newSmtpConfig) {
  emailService.updateSmtpConfig(newSmtpConfig);
}

// ==================== Geo Data Sync Usage ====================

/**
 * 1. Initialize Geo Data Sync Cron Job
 */
const GeoDataSyncCronJob = require('./service/geoDataSyncCronJob');
const { coreEngineZoneApi } = require('./integration'); // Your API integration

const geoDataSync = new GeoDataSyncCronJob(coreEngineZoneApi);
geoDataSync.start(); // Runs automatically on 1st of month at 02:00 AM

/**
 * 2. Trigger manual geo data sync
 */
async function triggerGeoDataSync(userId) {
  const result = await geoDataSync.triggerManualSync(userId);
  console.log('Geo Data Sync Triggered:', result);
  return result;
}

/**
 * 3. Monitor geo data sync
 */
function checkGeoDataStatus() {
  const status = geoDataSync.getStatus();
  console.log('Geo Data Sync Status:', {
    taskName: status.taskName,
    isRunning: status.isRunning,
    activeWorkers: status.activeWorkers,
    lastExecution: status.lastExecutionTime,
    cronActive: status.cronActive,
    queuedTasks: status.queuedTasks
  });
}


function stopGeoDataSync() {
  geoDataSync.stop();
}

const AsyncTaskManager = require('./service/asyncTaskManager');

class ReportGenerationService extends AsyncTaskManager {
  constructor() {
    super('ReportGeneration', 'reportWorker.js');
    this.reports = new Map(); // Track report generation
  }

  start() {
    console.log('[ReportGeneration] Service started');
  }

  async executeTask(jobData = {}) {
    try {
      console.log(`[ReportGeneration] Generating report: ${jobData.reportId}`);
      // Implement your report generation logic
      this.lastExecutionTime = new Date();
      return {
        success: true,
        reportId: jobData.reportId,
        completedAt: new Date()
      };
    } catch (error) {
      console.error(`[ReportGeneration] Error: ${error.message}`);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async queueReport(reportType, filters) {
    const reportId = `report-${Date.now()}`;
    return this.triggerManualExecution({
      reportId,
      reportType,
      filters,
      userId: 'SYSTEM'
    });
  }
}

// Usage
const reportService = new ReportGenerationService();
reportService.queueReport('sales', { month: 'May', year: 2026 });

// ==================== Environment Variables Setup ====================

/**
 * Required environment variables for Email Service:
 * 
 * SMTP_HOST=smtp.gmail.com
 * SMTP_PORT=587
 * SMTP_SECURE=false
 * SMTP_USER=your-email@gmail.com
 * SMTP_PASS=your-app-password
 */

// ==================== Integration in Express Routes ====================

/**
 * Example route handlers
 */
const express = require('express');
const router = express.Router();

// Send email via API
router.post('/api/email/send', async (req, res) => {
  try {
    const { to, subject, html } = req.body;
    const emailId = await emailService.queueEmail({ to, subject, html });
    res.json({ success: true, emailId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check email queue status
router.get('/api/email/status', (req, res) => {
  const status = emailService.getQueueStatus();
  res.json(status);
});

// Trigger geo data sync
router.post('/api/geo/sync', async (req, res) => {
  try {
    const { userId } = req.body;
    const result = await geoDataSync.triggerManualSync(userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check geo sync status
router.get('/api/geo/status', (req, res) => {
  const status = geoDataSync.getStatus();
  res.json(status);
});

module.exports = router;

// ==================== Server Startup Example ====================

/**
 * Initialize all services on application start
 */
async function initializeBackgroundServices() {
  try {
    // Start email service
    emailService.start();
    console.log('✓ Email service initialized');

    // Start geo data sync
    geoDataSync.start();
    console.log('✓ Geo data sync initialized');

    console.log('✓ All background services started successfully');
  } catch (error) {
    console.error('Failed to initialize background services:', error);
    process.exit(1);
  }
}

/**
 * Graceful shutdown
 */
async function shutdownBackgroundServices() {
  console.log('Shutting down background services...');
  emailService.stop();
  geoDataSync.stop();
  console.log('✓ All services stopped');
}

// On process exit
process.on('SIGTERM', shutdownBackgroundServices);
process.on('SIGINT', shutdownBackgroundServices);

module.exports = {
  initializeBackgroundServices,
  shutdownBackgroundServices,
  emailService,
  geoDataSync,
  sendWelcomeEmail,
  notifyMultipleUsers,
  checkEmailStatus,
  triggerGeoDataSync,
  checkGeoDataStatus
};
