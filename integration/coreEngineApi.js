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
      const response = await this.axios[method](url, ...requestData);
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
    console.log('📍 Making request to Core Engine:', requestParams);
    const response = await this.requestHandler.doRequest(requestParams);
    return response;
  }

  /**
   * Authenticate user with core-engine
   * @param {string} email
   * @param {string} password
   * @returns {Promise<Object>} { status, data: { accessToken, refreshToken, user }, error }
   */
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

  /**
   * Refresh access token
   * @param {string} refreshToken
   * @returns {Promise<Object>} { status, data: { accessToken, user }, error }
   */
  async refreshToken(refreshToken) {
    const payload = { refreshToken };

    return this.doRequest('/auth/refresh', {
      method: 'post',
      payload,
    });
  }

  /**
   * Logout user
   * @param {string} refreshToken
   * @returns {Promise<Object>} { status, data, error }
   */
  async logout(refreshToken) {
    const payload = { refreshToken };

    return this.doRequest('/auth/logout', {
      method: 'post',
      payload,
    });
  }
}

// Singleton instance
const coreEngineApi = new CoreEngineApi();

module.exports = coreEngineApi;
