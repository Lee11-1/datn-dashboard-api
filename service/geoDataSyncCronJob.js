const cron = require('node-cron');
const gadmService = require('./gadmService');
const coreEngineZoneApi = require('../integration/coreEngineZoneApi');
const { spawn } = require('child_process');
const path = require('path');


class GeoDataSyncCronJob {
  constructor() {
    this.cronJob = null;
    this.isRunning = false;
    this.lastSyncTime = null;
  }

  spawnWorker(userId = '0fa65e3a-05f3-489e-9f11-f9c41ec949ca') {
    try {
      const workerPath = path.join(__dirname, 'geoDataSyncWorker.js');
      const child = spawn(process.execPath, [workerPath, userId], {
        detached: true,
        stdio: 'ignore',
        env: { ...process.env, SYNC_TRIGGERED_BY: userId }
      });
      child.unref();
      console.log(` Spawned geo sync worker (pid ${child.pid})`);
      return child.pid;
    } catch (err) {
      console.error(' Failed to spawn geo sync worker:', err.message);
      return null;
    }
  }

  start() {
    
    this.cronJob = cron.schedule('0 2 1 * *', () => {
      console.log('\n Starting scheduled geo data sync from GADM... (spawning worker)');
      this.spawnWorker();
    });

    console.log(' Geo data sync cron job initialized');
  }

  async triggerManualSync(userId = '0fa65e3a-05f3-489e-9f11-f9c41ec949ca') {
    console.log(`\n Manual geo data sync requested by ${userId} (spawning worker)...`);
    const pid = this.spawnWorker(userId);
    return { spawned: !!pid, pid };
  }

  async syncGeoData(userId = '0fa65e3a-05f3-489e-9f11-f9c41ec949ca') {
    if (this.isRunning) {
      console.warn('  Sync already in progress, skipping');
      return;
    }

    this.isRunning = true;
    const startTime = new Date();
    let updateRecordId = null;
    let syncStats = {
      totalRecords: 0,
      processedRecords: 0,
      insertedRecords: 0,
      updatedRecords: 0,
      deactivatedRecords: 0,
      errorRecords: 0,
      errors: []
    };

    try {
      console.log(' Creating geo data update record...');
      const version = new Date().toISOString().split('T')[0]; 
      const updateRecord = await coreEngineZoneApi.createGeoDataUpdate({
        source: 'gadm',
        version,
        zonesAdded: 0,
        zonesUpdated: 0,
        zonesRemoved: 0,
        status: 'IN_PROGRESS',
        errorDetail: [],
        triggeredBy: userId
      });
      console.log(` Geo data update record created:`, updateRecord);

      updateRecordId = updateRecord.data?.id || updateRecord.id;
      
      const rawWards = await gadmService.fetchWards();
      const wards = Array.isArray(rawWards) ? rawWards.map(formatZoneData) : [];
      syncStats.totalRecords = wards.length;
      const syncPayload = {
        zones: wards,
        updateRecordId,
        source: 'GADM',
        timestamp: new Date(),
        userId
      };

      console.log(' Syncing zones with core engine');
      const syncResult = await coreEngineZoneApi.syncZones(syncPayload);
      syncStats = {
        ...syncStats,
        ...syncResult.statistics,
        processedRecords: syncResult.statistics?.processedRecords || wards.length
      };

     
      if (syncStats.errorRecords > 0) {
        console.log(`   - Errors: ${syncStats.errorRecords}`);
      }

      const endTime = new Date();
      const duration = endTime - startTime;
      
      await coreEngineZoneApi.updateGeoDataUpdate(updateRecordId, {
        status: syncStats.errorRecords > 0 ? 'COMPLETED_WITH_ERRORS' : 'COMPLETED',
        zonesAdded: syncStats.insertedRecords,
        zonesUpdated: syncStats.updatedRecords,
        zonesRemoved: syncStats.deactivatedRecords,
        errorDetail: syncStats.errors,
        triggeredBy: userId
      });

      this.lastSyncTime = new Date();
      console.log(`\n Geo data sync completed successfully (${duration}ms)`);
      
      return {
        success: true,
        updateRecordId,
        statistics: syncStats,
        duration
      };

    } catch (error) {
      console.error(`\n Error during geo data sync: ${error.message}`);
      
      if (updateRecordId) {
        try {
          await coreEngineZoneApi.updateGeoDataUpdate(updateRecordId, {
            status: 'FAILED',
            errorDetail: [{
              code: 'SYNC_FAILED',
              message: error.message,
              timestamp: new Date()
            }],
            triggeredBy: userId
          });
        } catch (updateError) {
          console.error(`Failed to update error record: ${updateError.message}`);
        }
      }

      return {
        success: false,
        error: error.message,
        updateRecordId
      };

    } finally {
      this.isRunning = false;
    }
  }

  stop() {
    if (this.cronJob) {
      this.cronJob.stop();
      console.log(' Geo data sync cron job stopped');
    }
  }


  getStatus() {
    return {
      isRunning: this.isRunning,
      lastSyncTime: this.lastSyncTime,
      cronActive: this.cronJob !== null
    };
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

module.exports = new GeoDataSyncCronJob();
module.exports.formatZoneData = formatZoneData;
