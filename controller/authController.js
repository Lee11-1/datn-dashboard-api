const coreEngineApi = require('../integration/coreEngineApi');

class AuthController {
  async login(ctx) {
    try {
      const { username, password } = ctx.request.body;

      if (!username || !password) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: 'Username and password are required',
        };
        return;
      }

      const response = await coreEngineApi.authenticate({ username, password });

      if (response.status === 200 || response.status === 201) {
        ctx.status = 200;
        ctx.body = {
          success: true,
          message: 'Login successful',
          data: response.data.data,
        };
      } else {
        ctx.status = response.status || 401;
        ctx.body = {
          success: false,
          message: response.data?.message || 'Authentication failed',
          error: response.error,
        };
      }
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: 'Internal server error',
        error: error.message,
      };
    }
  }

  async refreshToken(ctx) {
    try {
      const { refreshToken } = ctx.request.body;

      if (!refreshToken) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: 'Refresh token is required',
        };
        return;
      }

      const response = await coreEngineApi.refreshToken(refreshToken);

      if (response.status === 200 || response.status === 201) {
        ctx.status = 200;
        ctx.body = {
          success: true,
          message: 'Token refreshed successfully',
          data: response.data,
        };
      } else {
        ctx.status = response.status || 401;
        ctx.body = {
          success: false,
          message: response.data?.message || 'Token refresh failed',
          error: response.error,
        };
      }
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: 'Internal server error',
        error: error.message,
      };
    }
  }

  async logout(ctx) {
    try {
      const { refreshToken } = ctx.request.body;

      if (!refreshToken) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: 'Refresh token is required',
        };
        return;
      }

      const response = await coreEngineApi.logout(refreshToken);

      if (response.status === 200 || response.status === 201) {
        ctx.status = 200;
        ctx.body = {
          success: true,
          message: 'Logout successful',
        };
      } else {
        ctx.status = response.status || 400;
        ctx.body = {
          success: false,
          message: response.data?.message || 'Logout failed',
          error: response.error,
        };
      }
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: 'Internal server error',
        error: error.message,
      };
    }
  }
}

module.exports = new AuthController();
