const coreEngineScheduleApi = require('../integration/coreEngineScheduleApi');

/**
 * Schedule controller to handle schedule-related API requests
 * All data operations are delegated to the core engine
 */
class ScheduleController {
  /**
   * Create a new schedule
   * POST /api/schedules
   */
  async createSchedule(ctx) {
    try {
      const scheduleData = ctx.request.body;

      if (!scheduleData.zoneId || !scheduleData.userId) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: 'Missing required fields: zoneId, userId, scheduledDate'
        };
        return;
      }

      const result = await coreEngineScheduleApi.createSchedule(scheduleData);

      ctx.status = 201;
      ctx.body = {
        success: true,
        data: result.data || result
      };
    } catch (error) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Get all schedules with filters
   * GET /api/schedules
   */
  async getSchedules(ctx) {
    try {
      const result = await coreEngineScheduleApi.getSchedules(ctx.request.query);

      ctx.body = {
        success: true,
        data: result.data || result,
        pagination: result.pagination || null
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Get schedule statistics and overview
   * GET /api/schedules/stats/overview
   */
  async getStatistics(ctx) {
    try {
      const result = await coreEngineScheduleApi.getStatistics(ctx.request.query);

      ctx.body = {
        success: true,
        data: result.data || result,
        statistics: result.statistics || null
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Get schedules by date
   * GET /api/schedules/date/:date
   */
  async getSchedulesByDate(ctx) {
    try {
      const { date } = ctx.params;
      const result = await coreEngineScheduleApi.getSchedulesByDate(date, ctx.request.query);

      ctx.body = {
        success: true,
        data: result.data || result,
        pagination: result.pagination || null
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Get schedules by zone
   * GET /api/schedules/zone/:zoneId
   */
  async getSchedulesByZone(ctx) {
    try {
      const { zoneId } = ctx.params;
      const result = await coreEngineScheduleApi.getSchedulesByZone(zoneId, ctx.request.query);

      ctx.body = {
        success: true,
        data: result.data || result,
        pagination: result.pagination || null
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Get schedules by user
   * GET /api/schedules/user/:userId
   */
  async getSchedulesByUser(ctx) {
    try {
      const { userId } = ctx.params;
      const result = await coreEngineScheduleApi.getSchedulesByUser(userId, ctx.request.query);

      ctx.body = {
        success: true,
        data: result.data || result,
        pagination: result.pagination || null
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Get schedule by ID
   * GET /api/schedules/:id
   */
  async getScheduleById(ctx) {
    try {
      const { id } = ctx.params;
      const result = await coreEngineScheduleApi.getScheduleById(id);

      ctx.body = {
        success: true,
        data: result.data || result
      };
    } catch (error) {
      ctx.status = 404;
      ctx.body = {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Update schedule
   * PUT /api/schedules/:id
   */
  async updateSchedule(ctx) {
    try {
      const { id } = ctx.request.body || ctx.query;
      const updateData = ctx.request.body;

      const result = await coreEngineScheduleApi.updateSchedule(id, updateData);

      ctx.body = {
        success: true,
        data: result.data || result
      };
    } catch (error) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Change schedule status
   * PATCH /api/schedules/:id/status
   */
  async changeScheduleStatus(ctx) {
    try {
      const { id } = ctx.params;
      const statusData = ctx.request.body;

      if (!statusData.status) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: 'Status field is required'
        };
        return;
      }

      const result = await coreEngineScheduleApi.changeScheduleStatus(id, statusData);

      ctx.body = {
        success: true,
        data: result.data || result
      };
    } catch (error) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Assign schedule to warehouse
   * PATCH /api/schedules/:id/warehouse
   */
  async assignScheduleToWarehouse(ctx) {
    try {
      const { id } = ctx.params;
      const assignData = ctx.request.body;

      if (!assignData.warehouseId) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: 'warehouseId field is required'
        };
        return;
      }

      const result = await coreEngineScheduleApi.assignScheduleToWarehouse(id, assignData);

      ctx.body = {
        success: true,
        data: result.data || result
      };
    } catch (error) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Delete schedule
   * DELETE /api/schedules/:id
   */
  async deleteSchedule(ctx) {
    try {
      const { id } = ctx.params;
      const result = await coreEngineScheduleApi.deleteSchedule(id);

      ctx.body = {
        success: true,
        data: result.data || result,
        message: 'Schedule deleted successfully'
      };
    } catch (error) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: error.message
      };
    }
  }
}

module.exports = new ScheduleController();
