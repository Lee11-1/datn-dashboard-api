const axios = require('axios');

class RequestHandler {
  constructor(baseUrl) {
    this.axios = axios.create({
      baseURL: baseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  makeRequestData({ method, payload, headers = null }) {
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };
    
    const finalHeaders = headers ? { ...defaultHeaders, ...headers } : defaultHeaders;

    if (method === 'get' || method === 'delete') {
      const params = {};
      if (payload) {
        Object.keys(payload).forEach((k) => {
          let v = payload[k];
          if (Array.isArray(v)) v = v.join(',');
          params[k] = v;
        });
      }
      return [{ headers: finalHeaders, params: params }];
    } else if (method === 'post' || method === 'put' || method === 'patch') {
      return [payload, { headers: finalHeaders }];
    }
  }

  async doRequest({ url, method, payload, headers }) {
    payload = Object.assign({}, payload);
    if (!payload || !(payload instanceof Object)) payload = {};

    const requestData = this.makeRequestData({
      method,
      payload,
      headers,
    });

    const result = {
      status: 200,
      data: null,
      error: null,
      message: null,
    };

    try {
      const response = await  this.axios[method](url, ...requestData);
      result.status = response.status;
      result.data = response.data;
    } catch (error) {
      const response = error.response || {};
      result.status = response.status || 500;
      result.data = response.data || { error: 'UnknownError' };
      result.error = error.message;
    }
    return result;
  }
}

class CoreEngineApi {
  constructor() {
    const coreEngineUrl = process.env.CORE_ENGINE_API_URL || 'http://localhost:3000';
    this.requestHandler = new RequestHandler(coreEngineUrl);
  }

  async doRequest(endpoint, { method = 'post', payload, headers }) {
    let finalHeaders = { ...headers };
    const requestParams = {
      url: endpoint,
      headers: finalHeaders,
      method,
      payload,
    };
    const response = await  this.requestHandler.doRequest(requestParams);
    return response.data;
  }

  async authenticate({ username, password }) {
    const payload = {
      username,
      password,
      scope_type: 'System',
    };

    return this.doRequest('/auth/login', {
      method: 'post',
      payload,
    });
  }

  async refreshToken(refreshToken) {
    const payload = { refreshToken };

    return this.doRequest('/auth/refresh', {
      method: 'post',
      payload,
    });
  }


  async logout(refreshToken) {
    const payload = { refreshToken };
    return this.doRequest('/auth/logout', {
      method: 'post',
      payload,
    });
  }

  async createLog(payload){
    return this.doRequest('/logs', {
      method: 'post',
      payload,
    });
  };

   async createCategory(categoryData) {
    return  this.doRequest('/api/categories', {
      method: 'post',
      payload: categoryData,
    });
  }

  async getCategories(query) {
    return await this.doRequest('/api/categories', {
      method: 'get',
      payload: query,
    });
  
  }

  async updateCategory(id, updates) {
    return  this.doRequest(`/api/categories/${id}`, {
      method: 'put',
      payload: updates,
    });
  }

  async deleteCategory(id) {
    return  this.doRequest(`/api/categories/${id}`, {
      method: 'delete',
    });
  }

    async createCustomer(customerData) {
    return this.doRequest('/api/customers', {
      method: 'post',
      payload: customerData,
    });
  }

  async getCustomers(query) {
    return this.doRequest('/api/customers', {
      method: 'get',
      payload: query,
    });
  }

  async getCustomerById(id) {
    return this.doRequest(`/api/customers/${id}`, {
      method: 'get',
    });
  }

  async updateCustomer(id, updates) {
    return this.doRequest(`/api/customers/${id}`, {
      method: 'put',
      payload: updates,
    });
  }

  async deleteCustomer(id) {
    return this.doRequest(`/api/customers/${id}`, {
      method: 'delete',
    });
  }

  async getCustomersByZone(zoneId, query = {}) {
    return this.doRequest(`/api/customers/zone/${zoneId}`, {
      method: 'get',
      payload: query,
    });
  }

   async getInventory(query) {
    return this.doRequest('/inventory', {
      method: 'get',
      payload: query
    });
  }

  async createQuantity(data) {
    return this.doRequest('/inventory', {
      method: 'post',
      payload: data
    });
  }

  async deleteInventory(payload) {

    return this.doRequest(`/inventory`, {
      method: 'delete',
      payload: payload
    });
  }


  async createInventory(inventoryData) {
    return this.doRequest('/inventory', {
      method: 'post',
      payload: inventoryData
    });
  }


  async updateInventory(id, updateData) {
    return this.doRequest(`/inventory/${id}`, {
      method: 'put',
      payload: updateData
    });
  }

   async updateInventories(updateData) {
     return this.doRequest(`/inventory/batch-update`, {
      method: 'post',
      payload: updateData
    });

  }

  async getOrders(query) {
    return this.doRequest('/api/orders', {
      method: 'get',
      payload: query
    });
  }

  async getOrdersBySchedule(scheduleId, query = {}) {
    return this.doRequest(`/api/orders/schedule/${scheduleId}`, {
      method: 'get',
      payload: query
    });
  }

  async getOrderItems(orderId) {
    return this.doRequest(`/api/orders/${orderId}/items`, {
      method: 'get'
    });
  }

  async getOrdersByStatus(status, query = {}) {
    return this.doRequest('/api/orders', {
      method: 'get',
      payload: { ...query, status }
    });
  }

  async getOrderDetail(orderId) {
    return this.doRequest(`/api/orders/${orderId}`, {
      method: 'get'
    });
  }

  async updateOrderStatus(orderId, data) {
    return this.doRequest(`/api/orders/${orderId}/status`, {
      method: 'patch',
      payload: data
    });
  }

  async approveOrder(orderId, approvedBy, note = '', inventories) {
    return this.doRequest(`/api/orders/${orderId}/approve`, {
      method: 'patch',
      payload: {
        status: 'approved',
        approvedBy,
        note,
        inventories
      }
    });
  }

  async rejectOrder(orderId, rejectReason, rejectNote = '') {
    return this.doRequest(`/api/orders/${orderId}/status`, {
      method: 'patch',
      payload: {
        status: 'rejected',
        rejectReason,
        rejectNote
      }
    });
  }
  
  async getOrdersByUser(userId, params) {
      return this.doRequest(`/api/orders/user/${userId}`, {
        method: 'get',
        payload: params
      });
  }

    async createProduct(productData) {
    return this.doRequest('/api/products', {
      method: 'post',
      payload: productData,
    });
  }

  async getProducts(query) {
    return this.doRequest('/api/products', {
      method: 'get',
      payload: query,
    });
  }

  async getProductById(id) {
    return this.doRequest(`/api/products/${id}`, {
      method: 'get',
    });
  }

  async updateProduct(id, updates) {
    return this.doRequest(`/api/products/${id}`, {
      method: 'put',
      payload: updates,
    });
  }

  async deleteProduct(id) {
    return this.doRequest(`/api/products/${id}`, {
      method: 'delete',
    });
  }

   async createWarehouse(warehouseData) {
    return this.doRequest('/api/warehouses', {
      method: 'post',
      payload: warehouseData
    });
  }

  async getWarehouses(query) {
    return this.doRequest('/api/warehouses', {
      method: 'get',
      payload: query
    });
  }


  async getWarehouseById(id) {
    return this.doRequest(`/api/warehouses/${id}`, {
      method: 'get'
    });
  }

  async updateWarehouse(id, updateData) {
    return this.doRequest(`/api/warehouses/${id}`, {
      method: 'put',
      payload: updateData
    });
  }

  async deleteWarehouse(id) {
    return this.doRequest(`/api/warehouses/${id}`, {
      method: 'delete'
    });
  }

  async createSchedule(scheduleData) {
    return this.doRequest('/api/schedules', {
      method: 'post',
      payload: scheduleData
    });
  }

  async getSchedules(query) {
    return this.doRequest('/api/schedules', {
      method: 'get',
      payload: query
    });
  }
  
  async getScheduleById(id) {
    return this.doRequest(`/api/schedules/${id}`, {
      method: 'get'
    });
  }

  async getScheduleDetail(id) {
     return this.doRequest(`/api/schedules/detail/${id}`, {
      method: 'get'
    });
  }

  async getSchedulesByZone(zoneId, query = {}) {
    return this.doRequest(`/api/schedules/zone/${zoneId}`, {
      method: 'get',
      payload: query
    });
  }

  async getSchedulesByUser(userId, query = {}) {
    return this.doRequest(`/api/schedules/user/${userId}`, {
      method: 'get',
      payload: query
    });
  }

  async updateSchedule(id, updateData) {
    return this.doRequest(`/api/schedules/${id}`, {
      method: 'put',
      payload: updateData
    });
  }

  async deleteSchedule(id) {
    return this.doRequest(`/api/schedules/${id}`, {
      method: 'delete'
    });
  }

    async createUser(userData) {
    return this.doRequest('/api/users', {
      method: 'post',
      payload: userData,
    });
  }

  async getUsers(query) {
    return this.doRequest('/api/users', {
      method: 'get',
      payload: query,
    });
  }

  async getUserById(id) {
    return this.doRequest(`/api/users/${id}`, {
      method: 'get',
    });
  }

  async updateUser(id, updates) {
    return this.doRequest(`/api/users/${id}`, {
      method: 'put',
      payload: updates,
    });
  }

  async deleteUser(id) {
    return this.doRequest(`/api/users/${id}`, {
      method: 'delete',
    });
  }

   async syncZones(syncData) {
      return this.doRequest('/api/zones/sync', {
        method: 'post',
        payload: syncData
      });
  }

  async createZone(zoneData) {
    return this.doRequest('/api/zones', {
      method: 'post',
      payload: zoneData
    });
  }

  async getZones(query) {
    return this.doRequest('/api/zones', {
      method: 'get',
      payload: query
    });
  }

  async getZoneById(id) {
    return this.doRequest(`/api/zones/${id}`, {
      method: 'get'
    });
  }

  async updateZone(id, updateData) {
    return this.doRequest(`/api/zones/${id}`, {
      method: 'put',
      payload: updateData
    });
  }

  async deleteZone(id) {
    return this.doRequest(`/api/zones/${id}`, {
      method: 'delete'
    });
  }

  async createGeoDataUpdate(updateData) {
    return this.doRequest('/api/geo-data-updates', {
      method: 'post',
      payload: updateData
    });
  }

  async updateGeoDataUpdate(id, updateData) {
    return this.doRequest(`/api/geo-data-updates/${id}`, {
      method: 'put',
      payload: updateData
    });
  }

  async getGeoDataUpdate() {
    return this.doRequest('/api/geo-data-updates', {
      method: 'get'
    });
  }

  async getOrdersByZoneWithCustomers(zoneId, query = {}) {
    return this.doRequest(`/api/orders/zone/${zoneId}/customers`, {
      method: 'get',
      payload: query
    });
  }
  
  async getTopRevenueZones(){
    return this.doRequest('/api/orders/top-revenue-zones', {
      method: 'get'
    });
  }

  async getOrderStatistics(query) {
    return this.doRequest('/api/orders/statistics', {
      method: 'get',
      payload: query
    });
  }

   async getTopCustomersOrderByZone(zoneId)  {
      return this.doRequest(`api/orders/zone/${zoneId}/customers`, {
        method: 'get'
      })
  }

  async getGeoDataUpdates(payload){
    return this.doRequest('/api/geo-data-updates', {
      method: 'get',
      payload
    });
  }

    async createPromotion(promotionData) {
    return this.doRequest('/api/promotions', {
      method: 'post',
      payload: promotionData,
    });

  }

  async getPromotions(query) {
    return this.doRequest('/api/promotions', {
      method: 'get',
      payload: query,
    });
  }


  async getPromotionById(id) {
    return this.doRequest(`/api/promotions/${id}`, {
      method: 'get',
    });

  }

  async updatePromotion(id, promotionData) {
   return this.doRequest(`/api/promotions/${id}`, {
      method: 'put',
      payload: promotionData,
    });
  }

  async deletePromotion(id) {
   return this.doRequest(`/api/promotions/${id}`, {
      method: 'delete',
    });
  }

  async updatePromotionStatus(id, status) {
    return this.doRequest(`/api/promotions/${id}/status`, {
      method: 'patch',
      payload: { status },
    });
  }

  async getActivePromotions() {
    return this.doRequest('/api/promotions/active', {
      method: 'get',
    });
  }

  async getPromotionsByZone(zoneId, query) {
    return this.doRequest(`/api/promotions/zone/${zoneId}`, {
      method: 'get',
      payload: query,
    });
  }

}

module.exports = new CoreEngineApi();
