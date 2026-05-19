const coreEngineApi = require('../integration/coreEngineApi');

class AuthService {

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

  async refreshAccessToken(refreshToken) {
    const response = await coreEngineApi.refreshToken(refreshToken);

    if (response.status !== 200 && response.status !== 201) {
      throw new Error(response.data?.message || 'Token refresh failed');
    }

    return response.data;
  }

  async logout(refreshToken) {
    const response = await coreEngineApi.logout(refreshToken);

    if (response.status !== 200 && response.status !== 201) {
      throw new Error(response.data?.message || 'Logout failed');
    }

    return response.data;
  }
}

module.exports = new AuthService();
