const fs = require('fs').promises;
const fsSync = require('fs');
const os = require('os');
const path = require('path');
const gadmService = require('./gadmService');
const coreEngineApi = require('../integration/coreEngineApi');

const LOCK_NAME = 'geo_data_sync.lock';
const lockPath = path.join(os.tmpdir(), LOCK_NAME);
console.log('============');
function getJobData() {
  try {
    if (process.env.JOB_DATA) {
      return JSON.parse(process.env.JOB_DATA);
    }
    if (process.argv[2]) {
      try {
        return JSON.parse(process.argv[2]);
      } catch {
        return { userId: process.argv[2] };
      }
    }
  } catch (err) {
    console.error('[GeoDataSyncWorker] Failed to parse job data:', err.message);
  }
  return { userId: 'SYSTEM' };
}

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

function formatZoneData(feature) {
  const props = feature && feature.properties ? feature.properties : {};
  const geometry = feature && feature.geometry ? feature.geometry : null;

  function removeDiacritics(str) {
    try {
      return str.normalize('NFD').replace(/\p{Diacritic}/gu, '');
    } catch (e) {
      return str.replace(/[\u0300-\u036f]/g, '');
    }
  }

  function mapLevel(raw) {
    if (!raw) return 'custom';
    const s = String(raw);
    const norm = removeDiacritics(s).toLowerCase();

    if (/\b(tinh|thanh pho|city|province)\b/.test(norm)) return 'province';
    if (/\b(huyen|quan|thi xa|district|urban district|town)\b/.test(norm)) return 'district';
    if (/\b(phuong|xa|thi tran|ward|commune|township)\b/.test(norm)) return 'ward';
    return 'custom';
  }

  const rawLevel = props.TYPE_3 || props.ENGTYPE_3 || '';

  return {
    code: props.GID_3 || props.GID_2 || props.GID_1 || null,
    name: props.NAME_3 || props.NAME_2 || props.NAME_1 || null,
    nameEn: props.VARNAME_3 || props.NL_NAME_3 || props.ENGTYPE_3 || null,
    level: mapLevel(rawLevel),
    boundary: geometry,
    areaKm2: null,
    parentCode: props.GID_2 || props.GID_1 || null
  };
}

async function run() {
  console.log('WORKER START');
  console.log('JOB:', process.env.JOB_DATA);
  const jobData = getJobData();
  const userId = jobData.userId || 'SYSTEM';
    await releaseLock();

  const locked = await obtainLock();
  if (!locked) {
    console.log('[GeoDataSyncWorker] Another sync is in progress, exiting.');
    process.exit(0);
  }

  try {
    console.log(`[GeoDataSyncWorker] Starting geo data sync (triggered by ${userId})`);

    const GeoDataSyncCronJob = require('./geoDataSyncCronJob');
    const geoDataSync = new GeoDataSyncCronJob(coreEngineApi);
    const data = await geoDataSync.executeTask();
    console.log('[GeoDataSyncWorker] Geo sync completed');
  } catch (err) {
    console.error('[GeoDataSyncWorker] Error:', err && err.message ? err.message : err);
    process.exit(1);
  } finally {
    await releaseLock();
    process.exit(0);
  }
}

if (require.main === module) {
  run();
}

module.exports = { formatZoneData, getJobData };

