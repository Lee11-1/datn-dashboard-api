const coreEngineOrdersApi = require('../integration/ordersIntegration');

class OrdersController {
  async getOrders(ctx) {
    try {
      const result = await coreEngineOrdersApi.getOrders(ctx.request.query);

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

  async getOrderDetail(ctx) {
    try {
      const { orderId } = ctx.params;

      const result = await coreEngineOrdersApi.getOrderDetail(orderId);

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

  async updateOrderStatus(ctx) {
    try {
      const { orderId } = ctx.params;
      const { status, rejectReason, rejectNote, approvedBy, note } = ctx.request.body;

      // Validate required fields
      if (!status) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: 'Status is required',
        };
        return;
      }

      // Validate reject reason if status is rejected
      if (status === 'rejected' && !rejectReason) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: 'Reject reason is required when rejecting an order',
        };
        return;
      }

      // Validate approvedBy if status is approved
      if (status === 'approved' && !approvedBy) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: 'Approver ID is required when approving an order',
        };
        return;
      }

      const data = {
        status,
      };

      if (rejectReason) data.rejectReason = rejectReason;
      if (rejectNote) data.rejectNote = rejectNote;
      if (approvedBy) data.approvedBy = approvedBy;
      if (note) data.note = note;

      const result = await coreEngineOrdersApi.updateOrderStatus(orderId, data);

      ctx.body = {
        success: true,
        message: `Order ${status} successfully`,
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

  async approveOrder(ctx) {
    try {
      const { orderId } = ctx.params;
      const { approvedBy, note = '' } = ctx.request.body;

      if (!approvedBy) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: 'Approver ID is required',
        };
        return;
      }

      const result = await coreEngineOrdersApi.approveOrder(orderId, approvedBy, note);

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

  async rejectOrder(ctx) {
    try {
      const { orderId } = ctx.params;
      const { rejectReason, rejectNote = '' } = ctx.request.body;

      if (!rejectReason) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: 'Reject reason is required',
        };
        return;
      }

      const result = await coreEngineOrdersApi.rejectOrder(orderId, rejectReason, rejectNote);

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
