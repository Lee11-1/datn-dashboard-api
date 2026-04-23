const coreEngineZoneApi = require('../integration/coreEngineZoneApi');
const geoDataSyncCronJob = require('../service/geoDataSyncCronJob');

/**
 * Zone controller to handle zone-related API requests
 * All data operations are delegated to the core engine
 */
class ZoneController {
  /**
   * Create a new zone
   */
  async createZone(ctx) {
    try {
      const zoneData = ctx.request.body;
      
      // Validate required fields
      if (!zoneData.code || !zoneData.name || zoneData.level === undefined) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: 'Missing required fields: code, name, level'
        };
        return;
      }

      const result = await coreEngineZoneApi.createZone(zoneData);

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

  /**
   * Get all zones with pagination and filters
   */
  async getZones(ctx) {
    try {
      const result = await coreEngineZoneApi.getZones(ctx.request.query);

      ctx.body = {
        success: true,
        data: result.data || result
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Get zone tree structure
   */
  async getZoneTree(ctx) {
    try {
      const tree = await coreEngineZoneApi.getZoneTree();

      ctx.body = {
        success: true,
        data: tree.data || tree
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Get zone by code
   */
  async getZoneByCode(ctx) {
    try {
      const { code } = ctx.params;
      const result = await coreEngineZoneApi.getZoneByCode(code);

      ctx.body = {
        success: true,
        data: result.data || result
      };
    } catch (error) {
      ctx.status = 404;
      ctx.body = {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Get zones by level
   */
  async getZonesByLevel(ctx) {
    try {
      const { level } = ctx.params;
      
      if (![0, 1, 2, 3].includes(parseInt(level))) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: 'Level must be 0, 1, 2, or 3'
        };
        return;
      }

      const result = await coreEngineZoneApi.getZonesByLevel(level);

      ctx.body = {
        success: true,
        data: result.data || result
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Get zone by ID
   */
  async getZoneById(ctx) {
    try {
      const { id } = ctx.params;
      const result = await coreEngineZoneApi.getZoneById(id);

      ctx.body = {
        success: true,
        data: result.data || result
      };
    } catch (error) {
      ctx.status = 404;
      ctx.body = {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Update zone
   */
  async updateZone(ctx) {
    try {
      const { id } = ctx.params;
      const updateData = ctx.request.body;
      const result = await coreEngineZoneApi.updateZone(id, updateData);

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

  /**
   * Delete zone
   */
  async deleteZone(ctx) {
    try {
      const { id } = ctx.params;
      const result = await coreEngineZoneApi.deleteZone(id);

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

  /**
   * Get child zones
   */
  async getChildZones(ctx) {
    try {
      const { parentId } = ctx.params;
      const result = await coreEngineZoneApi.getChildZones(parentId);

      ctx.body = {
        success: true,
        data: result.data || result
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Activate zone
   */
  async activateZone(ctx) {
    try {
      const { id } = ctx.params;
      const result = await coreEngineZoneApi.activateZone(id);

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

  /**
   * Deactivate zone
   */
  async deactivateZone(ctx) {
    try {
      const { id } = ctx.params;
      const result = await coreEngineZoneApi.deactivateZone(id);

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

  /**
   * Get geo data update records
   */
  async getGeoDataUpdates(ctx) {
    try {
      const response = await coreEngineZoneApi.getZones({
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

  /**
   * Get latest geo data update record
   */
  async getLatestGeoDataUpdate(ctx) {
    try {
      const result = await coreEngineZoneApi.getLatestGeoDataUpdate();

      ctx.body = {
        success: true,
        data: result.data || result
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Trigger manual geo data sync
   */
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
