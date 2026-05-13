const coreEngineApi = require('../integration/coreEngineApi');

const GeoDataSyncCronJob = require('../service/geoDataSyncCronJob');

const geoDataSyncCronJob = new GeoDataSyncCronJob(coreEngineApi);
class ZoneController {
  async createZone(ctx) {
    try {
      const zoneData = ctx.request.body;
      
      if (!zoneData.code || !zoneData.name || zoneData.level === undefined) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: 'Missing required fields: code, name, level'
        };
        return;
      }
      const result = await coreEngineApi.createZone(zoneData);

      ctx.status = 201;
      ctx.body = {
        success: true,
        data: result.data || result
      };
    } catch (error) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: error.message
      };
    }
  }

  async getZones(ctx) {
    try {
      const result = await coreEngineApi.getZones(ctx.request.query);

      ctx.body = {
        success: true,
        data: result.data || result,
        pagination: result.pagination || null
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: error.message
      };
    }
  }

  async updateZone(ctx) {
    try {
      const { id } = ctx.params;
      const updateData = ctx.request.body;
      const result = await coreEngineApi.updateZone(id, updateData);

      ctx.body = {
        success: true,
        data: result.data || result
      };
    } catch (error) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: error.message
      };
    }
  }

  async deleteZone(ctx) {
    try {
      const { id } = ctx.params;
      const result = await coreEngineApi.deleteZone(id);

      ctx.body = {
        success: true,
        data: result.data || result
      };
    } catch (error) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: error.message
      };
    }
  }

  async getGeoDataUpdates(ctx) {
    try {
      const response = await coreEngineApi.getZones({
        ...ctx.request.query,
        endpoint: '/api/geo-data-updates'
      });

      ctx.body = {
        success: true,
        data: response.data || response
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: error.message
      };
    }
  }

  async triggerGeoDataSync(ctx) {
    try {
      const userId = ctx.User?.id || 'MANUAL_USER';
      
      const status = geoDataSyncCronJob.getStatus();
      if (status.isRunning) {
        ctx.status = 409;
        ctx.body = {
          success: false,
          message: 'A geo data sync is already in progress'
        };
        return;
      }

      const result = await geoDataSyncCronJob.triggerManualSync(userId);

      ctx.body = {
        success: result.success,
        message: result.success ? 'Geo data sync triggered successfully' : result.error,
        data: result
      };
    } catch (error) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: error.message
      };
    }
  }

  async getSyncStatus(ctx) {
    try {
      const status = geoDataSyncCronJob.getStatus();

      ctx.body = {
        success: true,
        data: status
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: error.message
      };
    }
  }
}

module.exports = new ZoneController();
