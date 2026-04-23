const coreEngineApi = require('./coreEngineApi');

class CoreEngineCustomerApi {
  /**
   * Create a new customer
   * @param {Object} customerData - Customer data
   * @returns {Promise<Object>} Created customer
   */
  async createCustomer(customerData) {
    const response = await coreEngineApi.doRequest('/api/customers', {
      method: 'post',
      payload: customerData,
    });

    if (response.status !== 200 && response.status !== 201) {
      throw new Error(response.data?.message || 'Failed to create customer');
    }

    return response.data;
  }

  /**
   * Get all customers with pagination and filters
   * @param {Object} query - Query params { limit, offset, phone, email, zoneId }
   * @returns {Promise<Object>} { data: customers, pagination }
   */
  async getCustomers(query) {
    const response = await coreEngineApi.doRequest('/api/customers', {
      method: 'get',
      payload: query,
    });

    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Failed to fetch customers');
    }

    return response.data;
  }

  /**
   * Get customer by ID
   * @param {string} id - Customer ID
   * @returns {Promise<Object>} Customer object
   */
  async getCustomerById(id) {
    const response = await coreEngineApi.doRequest(`/api/customers/${id}`, {
      method: 'get',
    });

    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Customer not found');
    }

    return response.data;
  }

  /**
   * Update customer
   * @param {string} id - Customer ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated customer
   */
  async updateCustomer(id, updates) {
    const response = await coreEngineApi.doRequest(`/api/customers/${id}`, {
      method: 'put',
      payload: updates,
    });

    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Failed to update customer');
    }

    return response.data;
  }

  /**
   * Delete customer
   * @param {string} id - Customer ID
   * @returns {Promise<Object>} Deleted customer
   */
  async deleteCustomer(id) {
    const response = await coreEngineApi.doRequest(`/api/customers/${id}`, {
      method: 'delete',
    });

    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Failed to delete customer');
    }

    return response.data;
  }

  /**
   * Search customers by phone, email, or name
   * @param {string} searchTerm - Search term
   * @returns {Promise<Object>} { data: customers }
   */
  async searchCustomers(searchTerm) {
    const response = await coreEngineApi.doRequest('/api/customers/search', {
      method: 'get',
      payload: { term: searchTerm },
    });

    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Failed to search customers');
    }

    return response.data;
  }

  /**
   * Get customers by zone
   * @param {string} zoneId - Zone ID
   * @param {Object} query - Query params { limit, offset }
   * @returns {Promise<Object>} { data: customers, pagination }
   */
  async getCustomersByZone(zoneId, query = {}) {
    const response = await coreEngineApi.doRequest(`/api/customers/zone/${zoneId}`, {
      method: 'get',
      payload: query,
    });

    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Failed to fetch customers by zone');
    }

    return response.data;
  }
}

module.exports = new CoreEngineCustomerApi();
