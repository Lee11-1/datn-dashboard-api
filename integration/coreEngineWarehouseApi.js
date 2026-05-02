const coreEngineApi = require('./coreEngineApi');

/**
 * Core Engine Warehouse API Integration
 * Handles warehouse-related API calls to the core engine
 */
class CoreEngineWarehouseApi {
  /**
   * Create a new warehouse
   * @param {Object} warehouseData - Warehouse data
   * @returns {Promise<Object>} Created warehouse
   */
  async createWarehouse(warehouseData) {
    const response = await coreEngineApi.doRequest('/api/warehouses', {
      method: 'post',
      payload: warehouseData
    });

    if (response.status !== 200 && response.status !== 201) {
      throw new Error(response.data?.message || 'Failed to create warehouse');
    }

    return response.data;
  }

  /**
   * Get all warehouses with pagination and filters
   * @param {Object} query - Query params { limit, offset, status, zoneId, managerId }
   * @returns {Promise<Object>} { data: warehouses, pagination }
   */
  async getWarehouses(query) {
    const response = await coreEngineApi.doRequest('/api/warehouses', {
      method: 'get',
      payload: query
    });

    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Failed to fetch warehouses');
    }

    return response.data;
  }

  /**
   * Get warehouse by ID
   * @param {string} id - Warehouse ID
   * @returns {Promise<Object>} Warehouse object
   */
  async getWarehouseById(id) {
    const response = await coreEngineApi.doRequest(`/api/warehouses/${id}`, {
      method: 'get'
    });

    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Failed to fetch warehouse');
    }

    return response.data;
  }

  /**
   * Update warehouse
   * @param {string} id - Warehouse ID
   * @param {Object} updateData - Warehouse update data
   * @returns {Promise<Object>} Updated warehouse
   */
  async updateWarehouse(id, updateData) {
    const response = await coreEngineApi.doRequest(`/api/warehouses/${id}`, {
      method: 'put',
      payload: updateData
    });

    if (response.status !== 200 && response.status !== 201) {
      throw new Error(response.data?.message || 'Failed to update warehouse');
    }

    return response.data;
  }

  /**
   * Delete warehouse
   * @param {string} id - Warehouse ID
   * @returns {Promise<Object>} Deletion result
   */
  async deleteWarehouse(id) {
    const response = await coreEngineApi.doRequest(`/api/warehouses/${id}`, {
      method: 'delete'
    });

    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Failed to delete warehouse');
    }

    return response.data;
  }
}

module.exports = new CoreEngineWarehouseApi();
