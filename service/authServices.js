const coreEngineApi = require('../integration/coreEngineApi');

/**
 * Auth Service - Acts as a proxy to core-engine authentication
 * No longer handles database operations directly
 */
class AuthService {
  /**
   * Login - delegates to core-engine
   * @param {string} username or email
   * @param {string} password
   * @returns {Promise<Object>} { accessToken, refreshToken, user }
   */
  async login(username, password) {
    const response = await coreEngineApi.authenticate({
      email: username,
      password,
    });

    if (response.status !== 200 && response.status !== 201) {
      throw new Error(response.data?.message || 'Authentication failed');
    }

    return response.data;
  }

  /**
   * Refresh access token - delegates to core-engine
   * @param {string} refreshToken
   * @returns {Promise<Object>} { accessToken, user }
   */
  async refreshAccessToken(refreshToken) {
    const response = await coreEngineApi.refreshToken(refreshToken);

    if (response.status !== 200 && response.status !== 201) {
      throw new Error(response.data?.message || 'Token refresh failed');
    }

    return response.data;
  }

  /**
   * Logout - delegates to core-engine
   * @param {string} refreshToken
   * @returns {Promise<void>}
   */
  async logout(refreshToken) {
    const response = await coreEngineApi.logout(refreshToken);

    if (response.status !== 200 && response.status !== 201) {
      throw new Error(response.data?.message || 'Logout failed');
    }

    return response.data;
  }
}

module.exports = new AuthService();
