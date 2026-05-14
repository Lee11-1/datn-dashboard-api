const cron = require('node-cron');
const AsyncTaskManager = require('./asyncTaskManager');
const nodemailer = require('nodemailer');

class EmailService extends AsyncTaskManager {
  constructor(smtpConfig = {}) {
    super('EmailService', 'emailWorker.js');
    this.cronJob = null;
    this.smtpConfig = smtpConfig;
    this.transporter = null;
    this.emailQueue = [];
    this.maxRetries = 3;
    this.retryDelay = 5000; // 5 seconds
    this.setMaxWorkers(3); // Max 3 concurrent email workers
    
    this.initializeTransporter();
  }

  /**
   * Initialize email transporter with SMTP configuration
   */
  initializeTransporter() {
    try {
      this.transporter = nodemailer.createTransport(this.smtpConfig);
      console.log('[EmailService] Transporter initialized');
    } catch (err) {
      console.error('[EmailService] Failed to initialize transporter:', err.message);
    }
  }

  /**
   * Start the email service with periodic queue processing
   */
  start() {
    // Process email queue every 30 seconds
    this.cronJob = cron.schedule('*/30 * * * * *', () => {
      this.processQueue();
    });
    console.log('[EmailService] Email service started - processing queue every 30 seconds');
  }

  /**
   * Queue an email for sending
   * @param {Object} emailData - Email configuration
   * @param {string} emailData.to - Recipient email
   * @param {string} emailData.subject - Email subject
   * @param {string} emailData.html - HTML content
   * @param {string} emailData.text - Plain text content
   * @param {string} emailData.from - Sender email (optional)
   * @param {number} emailData.retryCount - Current retry count (internal)
   */
  async queueEmail(emailData = {}) {
    const email = {
      ...emailData,
      id: `email-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      queuedAt: new Date(),
      retryCount: 0
    };

    this.emailQueue.push(email);
    console.log(`[EmailService] Email queued for ${emailData.to}. Queue size: ${this.emailQueue.length}`);
    
    // Trigger immediate processing if workers available
    if (this.activeWorkers.size < this.maxWorkers) {
      this.processQueue();
    }

    return email.id;
  }

  /**
   * Process queued emails respecting worker limits and rate limiting
   */
  async processQueue() {
    while (this.emailQueue.length > 0 && this.activeWorkers.size < this.maxWorkers) {
      const emailData = this.emailQueue.shift();
      
      // Spawn worker for this email
      const pid = this.spawnWorker({
        emailId: emailData.id,
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html,
        text: emailData.text,
        from: emailData.from,
        retryCount: emailData.retryCount
      });

      if (!pid) {
        // Re-queue if worker spawn failed
        this.emailQueue.unshift(emailData);
        console.log(`[EmailService] Worker spawn failed, re-queuing email ${emailData.id}`);
        break;
      }
    }
  }

  /**
   * Send email directly (for immediate sending outside queue)
   * @param {Object} emailData - Email configuration
   */
  async sendEmailDirect(emailData = {}) {
    try {
      const mailOptions = {
        from: emailData.from || this.smtpConfig.auth?.user || 'noreply@system.com',
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html,
        text: emailData.text || emailData.html.replace(/<[^>]*>/g, '')
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log(`[EmailService] Email sent directly to ${emailData.to}:`, result.messageId);
      
      this.lastExecutionTime = new Date();
      return {
        success: true,
        messageId: result.messageId,
        timestamp: new Date()
      };
    } catch (error) {
      console.error(`[EmailService] Error sending email: ${error.message}`);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Execute task in worker process
   * @param {Object} jobData - Email job data
   */
  async executeTask(jobData = {}) {
    // This will be called by the worker process
    // Worker implementation is in emailWorker.js
    try {
      const mailOptions = {
        from: jobData.from || this.smtpConfig.auth?.user || 'noreply@system.com',
        to: jobData.to,
        subject: jobData.subject,
        html: jobData.html,
        text: jobData.text || (jobData.html ? jobData.html.replace(/<[^>]*>/g, '') : '')
      };

      const result = await this.transporter.sendMail(mailOptions);
      return {
        success: true,
        emailId: jobData.emailId,
        messageId: result.messageId,
        sentAt: new Date()
      };
    } catch (error) {
      // Check if should retry
      const retryCount = jobData.retryCount || 0;
      if (retryCount < this.maxRetries) {
        console.log(`[EmailService] Will retry email ${jobData.emailId} (attempt ${retryCount + 1}/${this.maxRetries})`);
        return {
          success: false,
          emailId: jobData.emailId,
          error: error.message,
          shouldRetry: true,
          retryCount: retryCount + 1
        };
      }

      return {
        success: false,
        emailId: jobData.emailId,
        error: error.message,
        shouldRetry: false
      };
    }
  }

  /**
   * Batch send emails
   * @param {Array} emailList - Array of email configurations
   */
  async queueEmailBatch(emailList = []) {
    const results = emailList.map(email => this.queueEmail(email));
    return Promise.all(results);
  }

  /**
   * Get email queue status
   */
  getQueueStatus() {
    return {
      ...this.getStatus(),
      queuedEmails: this.emailQueue.length,
      emailQueueDetails: this.emailQueue.map(e => ({
        id: e.id,
        to: e.to,
        subject: e.subject,
        retryCount: e.retryCount,
        queuedAt: e.queuedAt
      }))
    };
  }

  /**
   * Stop email service
   */
  stop() {
    super.stop();
    if (this.cronJob) {
      this.cronJob.stop();
      console.log('[EmailService] Email service stopped');
    }
  }

  /**
   * Update SMTP configuration
   * @param {Object} newConfig - New SMTP configuration
   */
  updateSmtpConfig(newConfig = {}) {
    this.smtpConfig = { ...this.smtpConfig, ...newConfig };
    this.initializeTransporter();
    console.log('[EmailService] SMTP configuration updated');
  }
}

module.exports = EmailService;
