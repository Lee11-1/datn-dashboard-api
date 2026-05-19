const { spawn } = require('child_process');
const path = require('path');

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


  spawnWorker(jobData = {}) {
    try {
      const workerPath = path.join(__dirname, this.workerScript);
      const jobDataStr = JSON.stringify(jobData);
      
      const child = spawn(process.execPath, [workerPath, jobDataStr], {
        detached: false,
        stdio: 'inherit',
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

  async queueTask(jobData = {}) {
    this.taskQueue.push(jobData);
    console.log(`[${this.taskName}] Task queued. Queue size: ${this.taskQueue.length}`);
  }

  async processQueue() {
    while (this.taskQueue.length > 0 && this.activeWorkers.size < this.maxWorkers) {
      const jobData = this.taskQueue.shift();
      this.spawnWorker(jobData);
    }
  }

  async executeTask(jobData = {}) {
    throw new Error(`executeTask not implemented in ${this.constructor.name}`);
  }

  start() {
    throw new Error(`start() not implemented in ${this.constructor.name}`);
  }

  stop() {
    console.log(`[${this.taskName}] Stopping task manager`);
    this.activeWorkers.clear();
    this.taskQueue = [];
  }

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

  async triggerManualExecution(jobData = {}) {
    const pid = this.spawnWorker(jobData);
    return {
      spawned: !!pid,
      pid,
      timestamp: new Date()
    };
  }

  getWorkerInfo() {
    return Array.from(this.activeWorkers.values());
  }

  setMaxWorkers(max) {
    this.maxWorkers = Math.max(1, max);
    console.log(`[${this.taskName}] Max workers set to ${this.maxWorkers}`);
  }
}

module.exports = AsyncTaskManager;
