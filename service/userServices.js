const coreEngineUserApi = require('../integration/coreEngineUserApi');

/**
 * User Service - Acts as a proxy to core-engine user management
 * No longer handles database operations directly
 */
class UserService {
  /**
   * Create a new user - delegates to core-engine
   * @param {Object} userData - { username, email, password, fullName, phone, role }
   * @returns {Promise<Object>} Created user
   */
  async createUser(userData) {
    const { username, email, password, fullName, phone, role } = userData;

    if (!username || !email || !password || !fullName) {
      throw new Error('Missing required fields: username, email, password, fullName');
    }

    const response = await coreEngineUserApi.createUser({
      username,
      email,
      password,
      fullName,
      phone: phone || null,
      role: role || 'sale',
    });

    return response;
  }

  /**
   * Get users with pagination and filters - delegates to core-engine
   * @param {Object} query - { page, limit, role, status }
   * @returns {Promise<Object>} { users, pagination }
   */
  async getUsers(query) {
    const { page = 1, limit = 10, role, status } = query;

    const response = await coreEngineUserApi.getUsers({
      page: parseInt(page),
      limit: parseInt(limit),
      role,
      status,
    });

    return response;
  }

  /**
   * Get user by ID - delegates to core-engine
   * @param {string} id - User ID
   * @returns {Promise<Object>} User object
   */
  async getUserById(id) {
    const response = await coreEngineUserApi.getUserById(id);
    return response;
  }

  /**
   * Update user - delegates to core-engine
   * @param {string} id - User ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated user
   */
  async updateUser(id, updates) {
    // Remove sensitive fields
    delete updates.passwordHash;
    delete updates.password;

    const response = await coreEngineUserApi.updateUser(id, updates);
    return response;
  }

  /**
   * Delete user - delegates to core-engine
   * @param {string} id - User ID
   * @returns {Promise<Object>} Deleted user
   */
  async deleteUser(id) {
    const response = await coreEngineUserApi.deleteUser(id);
    return response;
  }
}

module.exports = new UserService();
