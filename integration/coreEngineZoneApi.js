const coreEngineApi = require('./coreEngineApi');


class CoreEngineZoneApi {
  /**
   * Sync zones data with core engine
   * @param {Object} syncData - Data to sync containing zones to insert/update and codes to deactivate
   * @returns {Promise<Object>} Sync result with statistics
   */
  async syncZones(syncData) {
    try {
      const response = await coreEngineApi.doRequest('/api/zones/sync', {
        method: 'post',
        payload: syncData
      });
      if (response.status !== 200 && response.status !== 201) {
        throw new Error(response.data?.message || 'Failed to sync zones');
      }

      return response.data;
    } catch (error) {
      console.error('❌ Error syncing zones:', error.message);
      throw error;
    }
  }

  /**
   * Create a single zone
   * @param {Object} zoneData - Zone data
   * @returns {Promise<Object>} Created zone
   */
  async createZone(zoneData) {
    const response = await coreEngineApi.doRequest('/api/zones', {
      method: 'post',
      payload: zoneData
    });

    if (response.status !== 200 && response.status !== 201) {
      throw new Error(response.data?.message || 'Failed to create zone');
    }

    return response.data;
  }

  /**
   * Get all zones with pagination and filters
   * @param {Object} query - Query params { limit, offset, level, code, name }
   * @returns {Promise<Object>} { data: zones, pagination }
   */
  async getZones(query) {
    const response = await coreEngineApi.doRequest('/api/zones', {
      method: 'get',
      payload: query
    });

    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Failed to fetch zones');
    }

    return response.data;
  }

  /**
   * Get zone tree structure
   * @returns {Promise<Object>} Zone tree
   */
  async getZoneTree() {
    const response = await coreEngineApi.doRequest('/api/zones/tree', {
      method: 'get'
    });

    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Failed to fetch zone tree');
    }

    return response.data;
  }

  /**
   * Get zone by code
   * @param {string} code - Zone code
   * @returns {Promise<Object>} Zone object
   */
  async getZoneByCode(code) {
    const response = await coreEngineApi.doRequest(`/api/zones/by-code/${code}`, {
      method: 'get'
    });

    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Failed to fetch zone');
    }

    return response.data;
  }

  /**
   * Get zones by level
   * @param {number} level - Zone level (0, 1, 2, 3)
   * @returns {Promise<Object>} Zones at specified level
   */
  async getZonesByLevel(level) {
    const response = await coreEngineApi.doRequest(`/api/zones/by-level/${level}`, {
      method: 'get'
    });

    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Failed to fetch zones');
    }

    return response.data;
  }

  /**
   * Get zone by ID
   * @param {string} id - Zone ID
   * @returns {Promise<Object>} Zone object
   */
  async getZoneById(id) {
    const response = await coreEngineApi.doRequest(`/api/zones/${id}`, {
      method: 'get'
    });

    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Failed to fetch zone');
    }

    return response.data;
  }

  /**
   * Update zone
   * @param {string} id - Zone ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated zone
   */
  async updateZone(id, updateData) {
    const response = await coreEngineApi.doRequest(`/api/zones/${id}`, {
      method: 'put',
      payload: updateData
    });

    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Failed to update zone');
    }

    return response.data;
  }

  /**
   * Delete zone
   * @param {string} id - Zone ID
   * @returns {Promise<Object>} Delete result
   */
  async deleteZone(id) {
    const response = await coreEngineApi.doRequest(`/api/zones/${id}`, {
      method: 'delete'
    });

    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Failed to delete zone');
    }

    return response.data;
  }

  /**
   * Get child zones
   * @param {string} parentId - Parent zone ID
   * @returns {Promise<Array>} Child zones
   */
  async getChildZones(parentId) {
    const response = await coreEngineApi.doRequest(`/api/zones/${parentId}/children`, {
      method: 'get'
    });

    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Failed to fetch child zones');
    }

    return response.data;
  }

  /**
   * Activate zone
   * @param {string} id - Zone ID
   * @returns {Promise<Object>} Updated zone
   */
  async activateZone(id) {
    const response = await coreEngineApi.doRequest(`/api/zones/${id}/activate`, {
      method: 'patch'
    });

    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Failed to activate zone');
    }

    return response.data;
  }

  /**
   * Deactivate zone
   * @param {string} id - Zone ID
   * @returns {Promise<Object>} Updated zone
   */
  async deactivateZone(id) {
    const response = await coreEngineApi.doRequest(`/api/zones/${id}/deactivate`, {
      method: 'patch'
    });

    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Failed to deactivate zone');
    }

    return response.data;
  }

  /**
   * Create or update geo data update record
   * @param {Object} updateData - Geo data update information
   * @param {string} updateData.source - Data source (e.g., 'GADM')
   * @param {string} updateData.version - Version identifier (e.g., date)
   * @param {number} updateData.zonesAdded - Number of zones added
   * @param {number} updateData.zonesUpdated - Number of zones updated
   * @param {number} updateData.zonesRemoved - Number of zones removed/deactivated
   * @param {string} updateData.status - Sync status (IN_PROGRESS, COMPLETED, FAILED, etc.)
   * @param {Array} updateData.errorDetail - Array of error objects
   * @param {string} updateData.triggeredBy - User or system that triggered the update
   * @returns {Promise<Object>} Created/updated record
   */
  async createGeoDataUpdate(updateData) {
    const response = await coreEngineApi.doRequest('/api/geo-data-updates', {
      method: 'post',
      payload: updateData
    });

    if (response.status !== 200 && response.status !== 201) {
      throw new Error(response.data?.message || 'Failed to create geo data update record');
    }

    return response.data;
  }

  /**
   * Update geo data update record
   * @param {string} id - Update record ID
   * @param {Object} updateData - Data to update
   * @param {number} updateData.zonesAdded - Number of zones added
   * @param {number} updateData.zonesUpdated - Number of zones updated
   * @param {number} updateData.zonesRemoved - Number of zones removed/deactivated
   * @param {string} updateData.status - Sync status
   * @param {Array} updateData.errorDetail - Array of error objects
   * @param {string} updateData.triggeredBy - User or system that triggered the update
   * @returns {Promise<Object>} Updated record
   */
  async updateGeoDataUpdate(id, updateData) {
    const response = await coreEngineApi.doRequest(`/api/geo-data-updates/${id}`, {
      method: 'put',
      payload: updateData
    });

    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Failed to update geo data update record');
    }

    return response.data;
  }

  /**
   * Get latest geo data update
   * @returns {Promise<Object>} Latest update record
   */
  async getLatestGeoDataUpdate() {
    const response = await coreEngineApi.doRequest('/api/geo-data-updates/latest', {
      method: 'get'
    });

    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Failed to fetch latest geo data update');
    }

    return response.data;
  }
}

module.exports = new CoreEngineZoneApi();
