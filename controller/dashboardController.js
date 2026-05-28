const BaseController = require('./baseController');
const DashboardService = require('../service/dashboardService');

const dashboardService = new DashboardService();

class DashboardController extends BaseController {
  constructor() {
    super();
  }

  /**
   * Get dashboard statistics
   */
  getStatistics = async (ctx) => {
    try {
      const { created_at, created_from, created_to } = ctx.request.query;
      
      let query = {};
      if (created_at) {
        const now = new Date();
        let fromDate = new Date();
        
        if (created_at === '0') {
          // Today
          fromDate.setHours(0, 0, 0, 0);
        } else if (created_at === '1') {
          // Yesterday
          fromDate = new Date(now);
          fromDate.setDate(fromDate.getDate() - 1);
          fromDate.setHours(0, 0, 0, 0);
          now.setHours(0, 0, 0, 0);
        } else if (created_at === '3' || created_at === '7' || created_at === '30') {
          // Last N days
          fromDate.setDate(now.getDate() - parseInt(created_at));
          fromDate.setHours(0, 0, 0, 0);
        }
        
        query.fromDate = fromDate;
        query.toDate = now;
      } else if (created_from && created_to) {
        // Custom range
        query.fromDate = new Date(created_from);
        query.toDate = new Date(created_to);
      }

      const statistics = await dashboardService.getStatistics(query);

      ctx.body = {
        success: true,
        data: statistics
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
   * Get top employees by revenue
   */
  getTopEmployees = async (ctx) => {
    try {
      const { created_at, created_from, created_to } = ctx.request.query;
      
      let query = {};
      if (created_at) {
        const now = new Date();
        let fromDate = new Date();
        
        if (created_at === '0') {
          // Today
          fromDate.setHours(0, 0, 0, 0);
        } else if (created_at === '1') {
          // Yesterday
          fromDate = new Date(now);
          fromDate.setDate(fromDate.getDate() - 1);
          fromDate.setHours(0, 0, 0, 0);
          now.setHours(0, 0, 0, 0);
        } else if (created_at === '3' || created_at === '7' || created_at === '30') {
          // Last N days
          fromDate.setDate(now.getDate() - parseInt(created_at));
          fromDate.setHours(0, 0, 0, 0);
        }
        
        query.fromDate = fromDate;
        query.toDate = now;
      } else if (created_from && created_to) {
        // Custom range
        query.fromDate = new Date(created_from);
        query.toDate = new Date(created_to);
      }

      const topEmployees = await dashboardService.getTopEmployeesByRevenue(query);

      ctx.body = {
        success: true,
        data: topEmployees
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
   * Get top customers by zone
   */
  getTopCustomersByZone = async (ctx) => {
    try {
      const { zoneId } = ctx.params;
      const { created_from, created_to } = ctx.request.query;

      if (!zoneId) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: 'Missing zoneId'
        };
        return;
      }

      let query = {};
      if (created_from && created_to) {
        query.fromDate = new Date(created_from);
        query.toDate = new Date(created_to);
      }

      const topCustomers = await dashboardService.getTopCustomersByZone(zoneId, query);

      ctx.body = {
        success: true,
        data: topCustomers
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
   * Get zones list
   */
  getZones = async (ctx) => {
    try {
      const zones = await dashboardService.getZones(ctx.request.query);

      ctx.body = {
        success: true,
        data: zones
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
   * Get zone with customers and their locations
   */
  getZoneWithCustomers = async (ctx) => {
    try {
      const { zoneId } = ctx.params;

      if (!zoneId) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: 'Missing zoneId'
        };
        return;
      }

      const zoneData = await dashboardService.getZoneWithCustomers(zoneId);

      ctx.body = {
        success: true,
        data: zoneData
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: error.message
      };
    }
  }
}

module.exports = DashboardController;
