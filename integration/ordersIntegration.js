const coreEngineApi = require('./coreEngineApi');

/**
 * Core Engine Orders API Integration
 * Handles all order-related API calls to the core engine
 */
class CoreEngineOrdersApi {
  /**
   * Get all orders with filters and pagination
   * @param {Object} query - Query params { limit, offset, status, sessionId, userId, customerId }
   * @returns {Promise<Object>} { data: orders, pagination }
   */
  async getOrders(query) {
    const response = await coreEngineApi.doRequest('/api/orders', {
      method: 'get',
      payload: query
    });

    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Failed to fetch orders');
    }

    return response.data;
  }

  /**
   * Get orders filtered by status
   * @param {string} status - Order status (pending, approved, rejected, cancelled)
   * @param {Object} query - Additional query params
   * @returns {Promise<Object>} { data: orders, pagination }
   */
  async getOrdersByStatus(status, query = {}) {
    const response = await coreEngineApi.doRequest('/api/orders', {
      method: 'get',
      payload: { ...query, status }
    });

    if (response.status !== 200) {
      throw new Error(response.data?.message || `Failed to fetch orders with status ${status}`);
    }

    return response.data;
  }

  /**
   * Get order by ID
   * @param {string} orderId - Order ID
   * @returns {Promise<Object>} Order object
   */
  async getOrderDetail(orderId) {
    const response = await coreEngineApi.doRequest(`/api/orders/${orderId}`, {
      method: 'get'
    });

    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Failed to fetch order detail');
    }

    return response.data;
  }

  /**
   * Update order status
   * @param {string} orderId - Order ID
   * @param {Object} data - Status update data { status, approvedBy?, note?, rejectReason?, rejectNote? }
   * @returns {Promise<Object>} Updated order
   */
  async updateOrderStatus(orderId, data) {
    const response = await coreEngineApi.doRequest(`/api/orders/${orderId}/status`, {
      method: 'patch',
      payload: data
    });

    if (response.status !== 200 && response.status !== 201) {
      throw new Error(response.data?.message || 'Failed to update order status');
    }

    return response.data;
  }

  /**
   * Approve order
   * @param {string} orderId - Order ID
   * @param {string} approvedBy - ID of approver
   * @param {string} note - Optional approval note
   * @returns {Promise<Object>} Updated order
   */
  async approveOrder(orderId, approvedBy, note = '') {
    const response = await coreEngineApi.doRequest(`/api/orders/${orderId}/status`, {
      method: 'patch',
      payload: {
        status: 'approved',
        approvedBy,
        note
      }
    });

    if (response.status !== 200 && response.status !== 201) {
      throw new Error(response.data?.message || 'Failed to approve order');
    }

    return response.data;
  }

  /**
   * Reject order
   * @param {string} orderId - Order ID
   * @param {string} rejectReason - Reason for rejection
   * @param {string} rejectNote - Optional detailed rejection note
   * @returns {Promise<Object>} Updated order
   */
  async rejectOrder(orderId, rejectReason, rejectNote = '') {
    const response = await coreEngineApi.doRequest(`/api/orders/${orderId}/status`, {
      method: 'patch',
      payload: {
        status: 'rejected',
        rejectReason,
        rejectNote
      }
    });

    if (response.status !== 200 && response.status !== 201) {
      throw new Error(response.data?.message || 'Failed to reject order');
    }

    return response.data;
  }
}

module.exports = new CoreEngineOrdersApi();
