const fs = require('fs').promises;
const fsSync = require('fs');
const os = require('os');
const path = require('path');

const job = require('./geoDataSyncCronJob');

const LOCK_NAME = 'geo_data_sync.lock';
const lockPath = path.join(os.tmpdir(), LOCK_NAME);

async function obtainLock() {
  try {
    const fh = await fs.open(lockPath, 'wx');
    await fh.write(String(process.pid));
    await fh.close();
    return true;
  } catch (err) {
    return false;
  }
}

async function releaseLock() {
  try {
    await fs.unlink(lockPath);
  } catch (e) {
  }
}

async function run() {
  const userId = process.env.SYNC_TRIGGERED_BY || process.argv[2] || 'SYSTEM';

  const locked = await obtainLock();
  if (!locked) {
    console.log('Geo sync worker: another run is in progress, exiting.');
    process.exit(0);
  }

  console.log(`Geo sync worker started by ${userId} (pid ${process.pid})`);

  try {
    if (typeof job.syncGeoData === 'function') {
      const res = await job.syncGeoData(userId);
      console.log('Geo sync worker finished:', res && res.success ? 'success' : 'finished');
    } else {
      console.error('Geo sync worker: syncGeoData not available');
    }
  } catch (err) {
    console.error('Geo sync worker error:', err && err.message ? err.message : err);
  } finally {
    await releaseLock();
    process.exit(0);
  }
}

if (require.main === module) {
  run();
}
