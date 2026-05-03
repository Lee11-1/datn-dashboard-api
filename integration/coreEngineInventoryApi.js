const coreEngineApi = require('./coreEngineApi');

/**
 * Core Engine Inventory API Integration
 * Handles inventory-related API calls to the core engine
 */
class CoreEngineInventoryApi {
  /**
   * Get all inventory items with pagination and filters
   * @param {Object} query - Query params { limit, offset, warehouseId, productId, status }
   * @returns {Promise<Object>} { data: inventory, pagination }
   */
  async getInventory(query) {
    const response = await coreEngineApi.doRequest('/inventory', {
      method: 'get',
      payload: query
    });

    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Failed to fetch inventory');
    }

    return response.data;
  }

  /**
   * Get inventory by ID
   * @param {string} id - Inventory ID
   * @returns {Promise<Object>} Inventory object
   */
  async getInventoryById(id) {
    const response = await coreEngineApi.doRequest(`/inventory/${id}`, {
      method: 'get'
    });

    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Failed to fetch inventory');
    }

    return response.data;
  }

  /**
   * Check available quantity for a product
   * @param {Object} data - { productId, warehouseId, quantity }
   * @returns {Promise<Object>} { available: boolean, availableQuantity: number }
   */
  async checkAvailableQuantity(data) {
    const response = await coreEngineApi.doRequest('/inventory/check-availability', {
      method: 'post',
      payload: data
    });

    if (response.status !== 200 && response.status !== 201) {
      throw new Error(response.data?.message || 'Failed to check availability');
    }

    return response.data;
  }

  /**
   * Reserve quantity from inventory
   * @param {Object} data - { productId, warehouseId, quantity, orderId }
   * @returns {Promise<Object>} Reservation result
   */
  async reserveQuantity(data) {
    const response = await coreEngineApi.doRequest('/inventory/reserve', {
      method: 'post',
      payload: data
    });

    if (response.status !== 200 && response.status !== 201) {
      throw new Error(response.data?.message || 'Failed to reserve quantity');
    }

    return response.data;
  }

  /**
   * Deduct quantity from inventory
   * @param {Object} data - { productId, warehouseId, quantity, reason }
   * @returns {Promise<Object>} Deduction result
   */
  async deductQuantity(data) {
    const response = await coreEngineApi.doRequest('/inventory/deduct', {
      method: 'post',
      payload: data
    });

    if (response.status !== 200 && response.status !== 201) {
      throw new Error(response.data?.message || 'Failed to deduct quantity');
    }

    return response.data;
  }

  /**
   * Add quantity to inventory
   * @param {Object} data - { productId, warehouseId, quantity, reason }
   * @returns {Promise<Object>} Addition result
   */
  async createQuantity(data) {
    const response = await coreEngineApi.doRequest('/inventory', {
      method: 'post',
      payload: data
    });

    if (response.status !== 200 && response.status !== 201) {
      throw new Error(response.data?.message || 'Failed to add quantity');
    }

    return response.data;
  }

  async deleteInventory(payload) {

    const response = await coreEngineApi.doRequest(`/inventory`, {
      method: 'delete',
      payload: payload
    });

    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Failed to delete inventory');
    }

    return response.data;
  }

  /**
   * Release reserved quantity
   * @param {Object} data - { productId, warehouseId, quantity, reservationId }
   * @returns {Promise<Object>} Release result
   */
  async releaseReservedQuantity(data) {
    const response = await coreEngineApi.doRequest('/inventory/release', {
      method: 'post',
      payload: data
    });

    if (response.status !== 200 && response.status !== 201) {
      throw new Error(response.data?.message || 'Failed to release reserved quantity');
    }

    return response.data;
  }

  /**
   * Transfer inventory between warehouses
   * @param {Object} data - { productId, fromWarehouseId, toWarehouseId, quantity }
   * @returns {Promise<Object>} Transfer result
   */
  async transferInventory(data) {
    const response = await coreEngineApi.doRequest('/inventory/transfer', {
      method: 'post',
      payload: data
    });

    if (response.status !== 200 && response.status !== 201) {
      throw new Error(response.data?.message || 'Failed to transfer inventory');
    }

    return response.data;
  }

  /**
   * Get movement history for inventory
   * @param {Object} query - Query params { limit, offset, productId, warehouseId, startDate, endDate }
   * @returns {Promise<Object>} { data: movements, pagination }
   */
  async getMovementHistory(query) {
    const response = await coreEngineApi.doRequest('/inventory/history/movements', {
      method: 'get',
      payload: query
    });

    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Failed to fetch movement history');
    }

    return response.data;
  }

  /**
   * Get low stock products
   * @param {Object} query - Query params { threshold, warehouseId, limit, offset }
   * @returns {Promise<Object>} { data: lowStockProducts, pagination }
   */
  async getLowStockProducts(query) {
    const response = await coreEngineApi.doRequest('/inventory/low-stock', {
      method: 'get',
      payload: query
    });

    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Failed to fetch low stock products');
    }

    return response.data;
  }

  /**
   * Get warehouse inventory summary
   * @param {string} warehouseId - Warehouse ID
   * @param {Object} query - Additional query params
   * @returns {Promise<Object>} Warehouse inventory summary
   */
  async getWarehouseSummary(warehouseId, query = {}) {
    const response = await coreEngineApi.doRequest(`/inventory/warehouse/${warehouseId}/summary`, {
      method: 'get',
      payload: query
    });

    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Failed to fetch warehouse summary');
    }

    return response.data;
  }

  /**
   * Create new inventory item
   * @param {Object} inventoryData - Inventory data
   * @returns {Promise<Object>} Created inventory
   */
  async createInventory(inventoryData) {
    const response = await coreEngineApi.doRequest('/inventory', {
      method: 'post',
      payload: inventoryData
    });

    if (response.status !== 200 && response.status !== 201) {
      throw new Error(response.data?.message || 'Failed to create inventory');
    }

    return response.data;
  }


  async updateInventory(id, updateData) {
    const response = await coreEngineApi.doRequest(`/inventory/${id}`, {
      method: 'put',
      payload: updateData
    });

    if (response.status !== 200 && response.status !== 201) {
      throw new Error(response.data?.message || 'Failed to update inventory');
    }

    return response.data;
  }
}

module.exports = new CoreEngineInventoryApi();
