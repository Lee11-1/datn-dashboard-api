const cron = require('node-cron');
const gadmService = require('./gadmService');
const AsyncTaskManager = require('./asyncTaskManager');

class GeoDataSyncCronJob extends AsyncTaskManager {
  constructor(coreEngineZoneApi) {
    super('GeoDataSync', 'geoDataSyncWorker.js');
    this.cronJob = null;
    this.coreEngineZoneApi = coreEngineZoneApi;
  }

  start() {
    this.cronJob = cron.schedule('0 2 1 * *', () => {
      this.spawnWorker({ userId: 'SYSTEM_SCHEDULED' });
    });
  }

  async triggerManualSync(userId = '0fa65e3a-05f3-489e-9f11-f9c41ec949ca') {
    return this.triggerManualExecution({ userId });
  }

  async executeTask(jobData = {}) {
    const userId = jobData.userId || '0fa65e3a-05f3-489e-9f11-f9c41ec949ca';
    
    if (this.isRunning) {
      console.warn('[GeoDataSync] Sync already in progress, skipping');
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
      const version = new Date().toISOString().split('T')[0]; 
      const updateRecord = await this.coreEngineZoneApi.createGeoDataUpdate({
        source: 'gadm',
        version,
        zonesAdded: 0,
        zonesUpdated: 0,
        zonesRemoved: 0,
        status: 'IN_PROGRESS',
        errorDetail: [],
        triggeredBy: userId
      });
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

      const syncResult = await this.coreEngineZoneApi.syncZones(syncPayload);
      syncStats = {
        ...syncStats,
        ...syncResult.statistics,
        processedRecords: syncResult.statistics?.processedRecords || wards.length
      };

      if (syncStats.errorRecords > 0) {
        console.log(`[GeoDataSync] - Errors: ${syncStats.errorRecords}`);
      }

      const endTime = new Date();
      const duration = endTime - startTime;
      
      await this.coreEngineZoneApi.updateGeoDataUpdate(updateRecordId, {
        status: syncStats.errorRecords > 0 ? 'COMPLETED_WITH_ERRORS' : 'COMPLETED',
        zonesAdded: syncStats.insertedRecords,
        zonesUpdated: syncStats.updatedRecords,
        zonesRemoved: syncStats.deactivatedRecords,
        errorDetail: syncStats.errors,
        triggeredBy: userId
      });

      this.lastExecutionTime = new Date();
      console.log(`[GeoDataSync] Completed successfully (${duration}ms)`);
      
      return {
        success: true,
        updateRecordId,
        statistics: syncStats,
        duration
      };

    } catch (error) {
      console.error(`[GeoDataSync] Error: ${error.message}`);
      
      if (updateRecordId) {
        try {
          await this.coreEngineZoneApi.updateGeoDataUpdate(updateRecordId, {
            status: 'FAILED',
            errorDetail: [{
              code: 'SYNC_FAILED',
              message: error.message,
              timestamp: new Date()
            }],
            triggeredBy: userId
          });
        } catch (updateError) {
          console.error(`[GeoDataSync] Failed to update error record: ${updateError.message}`);
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
    super.stop();
    if (this.cronJob) {
      this.cronJob.stop();
      console.log('[GeoDataSync] Cron job stopped');
    }
  }

  getStatus() {
    return {
      ...super.getStatus(),
      cronActive: this.cronJob !== null
    };
  }
}

/**
 * Format zone data from GADM feature
 * @param {Object} feature - GeoJSON feature from GADM
 * @returns {Object} Formatted zone data
 */
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

module.exports = GeoDataSyncCronJob;
module.exports.formatZoneData = formatZoneData;
