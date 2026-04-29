const coreEngineApi = require('./coreEngineApi');

/**
 * Core Engine Schedule API Integration
 * Handles all schedule-related API calls to the core engine
 */
class CoreEngineScheduleApi {
  /**
   * Create a new schedule
   * @param {Object} scheduleData - Schedule data
   * @returns {Promise<Object>} Created schedule
   */
  async createSchedule(scheduleData) {
    const response = await coreEngineApi.doRequest('/api/schedules', {
      method: 'post',
      payload: scheduleData
    });

    if (response.status !== 200 && response.status !== 201) {
      throw new Error(response.data?.message || 'Failed to create schedule');
    }

    return response.data;
  }

  /**
   * Get all schedules with filters and pagination
   * @param {Object} query - Query params { limit, offset, status, startDate, endDate, zoneId, userId }
   * @returns {Promise<Object>} { data: schedules, pagination }
   */
  async getSchedules(query) {
    const response = await coreEngineApi.doRequest('/api/schedules', {
      method: 'get',
      payload: query
    });

    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Failed to fetch schedules');
    }

    return response.data;
  }

  /**
   * Get schedule statistics and overview
   * @param {Object} query - Query params { startDate, endDate, zoneId }
   * @returns {Promise<Object>} Statistics data
   */
  async getStatistics(query) {
    const response = await coreEngineApi.doRequest('/api/schedules/stats/overview', {
      method: 'get',
      payload: query
    });

    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Failed to fetch schedule statistics');
    }

    return response.data;
  }

  /**
   * Get schedules by date
   * @param {string} date - Date in YYYY-MM-DD format
   * @param {Object} query - Additional query params
   * @returns {Promise<Object>} Schedules for the given date
   */
  async getSchedulesByDate(date, query = {}) {
    const response = await coreEngineApi.doRequest(`/api/schedules/date/${date}`, {
      method: 'get',
      payload: query
    });

    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Failed to fetch schedules by date');
    }

    return response.data;
  }

  /**
   * Get schedules by zone
   * @param {string} zoneId - Zone ID
   * @param {Object} query - Additional query params { limit, offset, status }
   * @returns {Promise<Object>} Schedules for the given zone
   */
  async getSchedulesByZone(zoneId, query = {}) {
    const response = await coreEngineApi.doRequest(`/api/schedules/zone/${zoneId}`, {
      method: 'get',
      payload: query
    });

    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Failed to fetch schedules by zone');
    }

    return response.data;
  }

  /**
   * Get schedules by user
   * @param {string} userId - User ID
   * @param {Object} query - Additional query params { limit, offset, status }
   * @returns {Promise<Object>} Schedules for the given user
   */
  async getSchedulesByUser(userId, query = {}) {
    const response = await coreEngineApi.doRequest(`/api/schedules/user/${userId}`, {
      method: 'get',
      payload: query
    });

    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Failed to fetch schedules by user');
    }

    return response.data;
  }

  /**
   * Get schedule by ID
   * @param {string} id - Schedule ID
   * @returns {Promise<Object>} Schedule object
   */
  async getScheduleById(id) {
    const response = await coreEngineApi.doRequest(`/api/schedules/${id}`, {
      method: 'get'
    });

    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Failed to fetch schedule');
    }

    return response.data;
  }

  /**
   * Update schedule
   * @param {string} id - Schedule ID
   * @param {Object} updateData - Schedule update data
   * @returns {Promise<Object>} Updated schedule
   */
  async updateSchedule(id, updateData) {
    const response = await coreEngineApi.doRequest(`/api/schedules/${id}`, {
      method: 'put',
      payload: updateData
    });

    if (response.status !== 200 && response.status !== 201) {
      throw new Error(response.data?.message || 'Failed to update schedule');
    }

    return response.data;
  }

  /**
   * Change schedule status
   * @param {string} id - Schedule ID
   * @param {Object} statusData - { status: 'pending', 'in_progress', 'completed', 'cancelled' }
   * @returns {Promise<Object>} Updated schedule
   */
  async changeScheduleStatus(id, statusData) {
    const response = await coreEngineApi.doRequest(`/api/schedules/${id}/status`, {
      method: 'patch',
      payload: statusData
    });

    if (response.status !== 200 && response.status !== 201) {
      throw new Error(response.data?.message || 'Failed to change schedule status');
    }

    return response.data;
  }

  /**
   * Assign schedule to warehouse
   * @param {string} id - Schedule ID
   * @param {Object} assignData - { warehouseId, warehouseName }
   * @returns {Promise<Object>} Updated schedule
   */
  async assignScheduleToWarehouse(id, assignData) {
    const response = await coreEngineApi.doRequest(`/api/schedules/${id}/warehouse`, {
      method: 'patch',
      payload: assignData
    });

    if (response.status !== 200 && response.status !== 201) {
      throw new Error(response.data?.message || 'Failed to assign schedule to warehouse');
    }

    return response.data;
  }

  /**
   * Delete schedule
   * @param {string} id - Schedule ID
   * @returns {Promise<Object>} Deletion result
   */
  async deleteSchedule(id) {
    const response = await coreEngineApi.doRequest(`/api/schedules/${id}`, {
      method: 'delete'
    });

    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Failed to delete schedule');
    }

    return response.data;
  }
}

module.exports = new CoreEngineScheduleApi();
