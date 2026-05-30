const coreEngineApi = require('../integration/coreEngineApi');
const analysService = require('../service/analysService');

class ScheduleController {
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

      const result = await coreEngineApi.createSchedule(scheduleData);

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

  async getSchedules(ctx) {
    try {
      const result = await coreEngineApi.getSchedules(ctx.request.query);

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

  async getScheduleById(ctx) {
    try{
      const { id } = ctx.request.query;
      const result = await coreEngineApi.getScheduleById(id);
      
      ctx.body = {
        success: true,
        data: result.data || result
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: error.message
      };
    }
  }

  async getScheduleDetail(ctx) {
    try{
      const { id } = ctx.request.query;
      const result = await coreEngineApi.getScheduleDetail(id);
      
      ctx.body = {
        success: true,
        data: result.data || result
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: error.message
      };
    }
  }

  async getSchedulesByZone(ctx) {
    try {
      const { zoneId } = ctx.params;
      const result = await coreEngineApi.getSchedulesByZone(zoneId, ctx.request.query);

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

  async getSchedulesByUser(ctx) {
    try {
      const { userId } = ctx.params;
      const result = await coreEngineApi.getSchedulesByUser(userId, ctx.request.query);

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

  async updateSchedule(ctx) {
    try {
      const { id } = ctx.request.body || ctx.query;
      const updateData = ctx.request.body;

      const result = await coreEngineApi.updateSchedule(id, updateData);

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

  async deleteSchedule(ctx) {
    try {
      const { id } = ctx.params;
      const result = await coreEngineApi.deleteSchedule(id);

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

    async getScheduleZoneAnalytics(ctx) {
    try {
        const { zoneId } = ctx.request.query

        if (!zoneId) {
        ctx.status = 400
        ctx.body = {
            success: false,
            message: 'zoneId is required'
        }
        return
        }

        const result = await analysService.getScheduleZoneAnalytics(
            zoneId
        )

        if (!result) {
        ctx.status = 404
        ctx.body = {
            success: false,
            message: 'Analytics data not found'
        }
        return
        }

        ctx.status = 200
        ctx.body = {
        success: true,
        data: result
        }

    } catch (error) {
        console.error('Error in getScheduleZoneAnalytics:', error)

        ctx.status = 500
        ctx.body = {
        success: false,
        message: error.message || 'Internal server error'
        }
    }
    }
}

module.exports = new ScheduleController();
