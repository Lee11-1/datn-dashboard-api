const { spawn } = require('child_process');
const path = require('path');

/**
 * Abstract base class for managing asynchronous background tasks with worker processes
 * Subclasses should implement start() and provide specific task logic
 */
class AsyncTaskManager {
  constructor(taskName, workerScript) {
    this.taskName = taskName;
    this.workerScript = workerScript;
    this.isRunning = false;
    this.lastExecutionTime = null;
    this.activeWorkers = new Map(); // Map<pid, workerInfo>
    this.maxWorkers = 5; // Maximum concurrent workers
    this.taskQueue = [];
  }

  /**
   * Spawn a worker process to execute the task
   * @param {Object} jobData - Data to pass to worker process
   * @param {string} jobData.userId - User ID triggering the task
   * @returns {number|null} Worker process ID or null if failed
   */
  spawnWorker(jobData = {}) {
    try {
      const workerPath = path.join(__dirname, this.workerScript);
      const jobDataStr = JSON.stringify(jobData);
      
      const child = spawn(process.execPath, [workerPath, jobDataStr], {
        detached: true,
        stdio: 'ignore',
        env: {
        ...process.env,
        TASK_NAME: this.taskName,
        JOB_DATA: jobDataStr,
        SMTP_HOST: this.smtpConfig?.host,
        SMTP_PORT: String(this.smtpConfig?.port || 587),
        SMTP_SECURE: String(this.smtpConfig?.secure || false),
        SMTP_USER: this.smtpConfig?.auth?.user,
        SMTP_PASS: this.smtpConfig?.auth?.pass
      }
      });

      child.unref();

      this.activeWorkers.set(child.pid, {
        pid: child.pid,
        startTime: new Date(),
        jobData
      });
      child.on('spawn', () => {
        console.log(`Worker ${child.pid} started`);
      });

      child.on('error', (err) => {
        console.error('Spawn error:', err);
      });

      child.on('exit', (code, signal) => {
        console.log(`Worker ${child.pid} exited code=${code} signal=${signal}`);
        this.activeWorkers.delete(child.pid);
      });

      return child.pid;
    } catch (err) {
      console.error(`[${this.taskName}] Failed to spawn worker: ${err.message}`);
      return null;
    }
  }

  /**
   * Queue a task for later execution
   * @param {Object} jobData - Task data
   */
  async queueTask(jobData = {}) {
    this.taskQueue.push(jobData);
    console.log(`[${this.taskName}] Task queued. Queue size: ${this.taskQueue.length}`);
  }

  /**
   * Process queued tasks respecting maxWorkers limit
   */
  async processQueue() {
    while (this.taskQueue.length > 0 && this.activeWorkers.size < this.maxWorkers) {
      const jobData = this.taskQueue.shift();
      this.spawnWorker(jobData);
    }
  }

  /**
   * Main task execution logic
   * Override this in subclasses for specific implementations
   * @param {Object} jobData - Task parameters
   */
  async executeTask(jobData = {}) {
    throw new Error(`executeTask not implemented in ${this.constructor.name}`);
  }

  /**
   * Start the task (e.g., schedule cron, start listener)
   * Must be implemented by subclasses
   */
  start() {
    throw new Error(`start() not implemented in ${this.constructor.name}`);
  }

  /**
   * Stop the task gracefully
   */
  stop() {
    console.log(`[${this.taskName}] Stopping task manager`);
    this.activeWorkers.clear();
    this.taskQueue = [];
  }

  /**
   * Get current status of the task manager
   */
  getStatus() {
    return {
      taskName: this.taskName,
      isRunning: this.isRunning,
      lastExecutionTime: this.lastExecutionTime,
      activeWorkers: this.activeWorkers.size,
      queuedTasks: this.taskQueue.length,
      maxWorkers: this.maxWorkers
    };
  }

  /**
   * Trigger manual execution
   * @param {Object} jobData - Task parameters
   */
  async triggerManualExecution(jobData = {}) {
    const pid = this.spawnWorker(jobData);
    return {
      spawned: !!pid,
      pid,
      timestamp: new Date()
    };
  }

  /**
   * Get worker information
   */
  getWorkerInfo() {
    return Array.from(this.activeWorkers.values());
  }

  /**
   * Set maximum concurrent workers
   */
  setMaxWorkers(max) {
    this.maxWorkers = Math.max(1, max);
    console.log(`[${this.taskName}] Max workers set to ${this.maxWorkers}`);
  }
}

module.exports = AsyncTaskManager;
