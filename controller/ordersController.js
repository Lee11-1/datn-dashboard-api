const coreEngineApi = require('../integration/coreEngineApi');
const OrderService = require('../service/orderService');
const EmailService = require('../service/emailService');
const BaseController = require('./baseController');
const smtpConfig = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_KEY,
  }
};

const emailService = new EmailService(smtpConfig);
const orderService = new OrderService(emailService);
class OrdersController extends BaseController {
  constructor() {
    super();
  }
  getOrders = async (ctx) => {
    try {
      const {customerId, status, page = 1, limit = 10} = ctx.request.query;
      if (customerId){
          const data = await this.redis.get(`orders:${customerId}`);
          if (data) {
            ctx.body = {
              success: true,
              data: JSON.parse(data)
            };
            return;
          }
      }
      const result = await coreEngineApi.getOrders(ctx.request.query);

      if (customerId){
        await this.redis.set(`orders:${customerId}`, JSON.stringify(result.data), 'EX', 3600);
      }
      ctx.body = {
        success: true,
        data: result.data,
        pagination: result.pagination,
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }

  getOrdersBySchedule = async (ctx) => {
    try {
      const { scheduleId, page = 1, limit = 10 } = ctx.request.query;
      if (!scheduleId) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: 'Missing scheduleId'
        };
        return;
      }
      const result = await coreEngineApi.getOrdersBySchedule(scheduleId, { page, limit });
      ctx.body = {
        success: true,
        data: result.data,
        pagination: result.data.pagination
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: error.message
      };
    }
  }

  getOrderDetail = async (ctx) => {
    try {
      const { orderId } = ctx.request.query;
      if (!orderId) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: 'Missing orderId'
        };
        return;
      }

      const data = await this.redis.get(`order_detail:${orderId}`);
      if (data) {
        ctx.body = {
          success: true,
          data: JSON.parse(data)
        };
        return;
      }

      const result = await coreEngineApi.getOrderDetail(orderId);

      await this.redis.set(`order_detail:${orderId}`, JSON.stringify(result.data), 'EX', 3600);

      ctx.body = {
        success: true,
        data: result.data,
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }

  updateOrderStatus = async (ctx) => {
    try {
      const { orderId } = ctx.params;
      const { status, rejectReason, rejectNote, approvedBy, note } = ctx.request.body;

      if (!status) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: 'Status is required',
        };
        return;
      }

      if (status === 'rejected' && !rejectReason) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: 'Reject reason is required when rejecting an order',
        };
        return;
      }

      if (status === 'approved' && !approvedBy) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: 'Approver ID is required when approving an order',
        };
        return;
      }

      const result = await coreEngineApi.updateOrderStatus(orderId, ctx.request.body);

      ctx.body = {
        success: true,
        message: `Order approved successfully`,
        data: result.data,
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }

  
  getOrdersByUser = async (ctx) => {
    try {
      const { userId, page = 1, limit = 10 } = ctx.request.query;
      if (!userId) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: 'Missing userId'
        };
        return;
      }
      const result = await coreEngineApi.getOrdersByUser(userId, { page, limit });
      ctx.body = {
        success: true,
        data: result.data.orders,
        pagination: result.data.pagination
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: error.message
      };
    }
  }

  approveOrder = async (ctx) => {
    try {
      const { approvedBy, note = '', orderId, userId, orderCode } = ctx.request.body;

      if (!approvedBy) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: 'Approver ID is required',
        };
        return;
      }

      const result = await orderService.approve(ctx.request.body);
      const data = await this.redis.get(`order_detail:${orderId}`);
      if (data) {
        await this.redis.del(`order_detail:${orderId}`);
      }

      ctx.body = {
        success: true,
        message: 'Order approved successfully',
        data: result.data,
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }

  rejectOrder = async (ctx) => {
    try {
      const { rejectReason, rejectNote = '', orderId } = ctx.request.body;

      if (!rejectReason) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: 'Reject reason is required',
        };
        return;
      }

      const result = await coreEngineApi.rejectOrder(orderId, rejectReason, rejectNote);

      ctx.body = {
        success: true,
        message: 'Order rejected successfully',
        data: result.data,
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }
}

module.exports = new OrdersController();
