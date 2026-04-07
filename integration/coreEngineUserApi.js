const coreEngineApi = require('./coreEngineApi');

class CoreEngineUserApi {
  /**
   * Create a new user
   * @param {Object} userData - User data { username, email, password, fullName, phone, role }
   * @returns {Promise<Object>} Created user object
   */
  async createUser(userData) {
    const response = await coreEngineApi.doRequest('/api/users', {
      method: 'post',
      payload: userData,
    });

    if (response.status !== 200 && response.status !== 201) {
      throw new Error(response.data?.message || 'Failed to create user');
    }

    return response.data;
  }

  /**
   * Get users with pagination and filters
   * @param {Object} query - Query params { page, limit, role, status }
   * @returns {Promise<Object>} { users, pagination }
   */
  async getUsers(query) {
    const response = await coreEngineApi.doRequest('/api/users', {
      method: 'get',
      payload: query,
    });

    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Failed to fetch users');
    }

    return response.data;
  }

  /**
   * Get user by ID
   * @param {string} id - User ID
   * @returns {Promise<Object>} User object
   */
  async getUserById(id) {
    const response = await coreEngineApi.doRequest(`/api/users/${id}`, {
      method: 'get',
    });

    if (response.status !== 200) {
      throw new Error(response.data?.message || 'User not found');
    }

    return response.data;
  }

  /**
   * Update user
   * @param {string} id - User ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated user object
   */
  async updateUser(id, updates) {
    const response = await coreEngineApi.doRequest(`/api/users/${id}`, {
      method: 'put',
      payload: updates,
    });

    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Failed to update user');
    }

    return response.data;
  }

  /**
   * Delete user
   * @param {string} id - User ID
   * @returns {Promise<Object>} Deleted user object
   */
  async deleteUser(id) {
    const response = await coreEngineApi.doRequest(`/api/users/${id}`, {
      method: 'delete',
    });

    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Failed to delete user');
    }

    return response.data;
  }
}

// Singleton instance
const coreEngineUserApi = new CoreEngineUserApi();

module.exports = coreEngineUserApi;
