const coreEngineApi = require('../integration/coreEngineApi');


class ComplaintController {

  async getComplaints(ctx) {
    try {
      const result = await coreEngineApi.getComplaints(ctx.query);

      ctx.body = {
        success: true,
        data: result.data || result,
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

  async updateComplaint(ctx) {
    try {
      const complaint = ctx.request.body;
      const response = await coreEngineApi.updateComplaint(complaint.id, complaint);
        
      if (response.success) {
        ctx.body = {
            success: true,
            message: 'Complaint updated successfully',
            data: response.data ,
        };
      }
   
    } catch (error) {
      if (error.message === 'Complaint not found') {
        ctx.status = 404;
      } else {
        ctx.status = 400;
      }
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }

  async updateComplaintStatus(ctx) {
    try{
        const { id, status } = ctx.request.body;
        if (!id || !status) {
            ctx.status = 400;
            ctx.body = {
                success: false,
                message: 'Missing id or status in request body',
            };
            return;
        }

        const response = await coreEngineApi.updateComplaintStatus(id, status);
        if (response.success) {
            ctx.body = {
                success: true,
                message: 'Complaint status updated successfully',
                data: response.data,
            };
        }
        else{
            ctx.status = 400;
            ctx.body = {
                success: false,
                message: 'Failed to update complaint status',
            };
        }
    }
    catch (error) {
        ctx.status = 400;
        ctx.body = {
            success: false,
            message: error.message,
        };
    }
  }

  async deleteComplaint(ctx) {
    try {
      const { id } = ctx.body.query;
      await coreEngineApi.deleteComplaint(id);

      ctx.body = {
        success: true,
        message: 'Complaint deleted successfully',
      };
    } catch (error) {
      if (error.message === 'Complaint not found') {
        ctx.status = 404;
      } else {
        ctx.status = 500;
      }
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }

  async getComplaintsByUser(ctx) {
    try {
      const {userId, limit = 50, offset = 0 } = ctx.request.query;

      const result = await coreEngineApi.getComplaintsByUser(
        userId,
        parseInt(limit),
        parseInt(offset)
      );

      ctx.body = {
        success: true,
        data: result.complaints,
        total: result.total,
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }
  
    async getComplaintsByCustomer(ctx) {
        try{

            const {customerId, limit = 50, offset = 0 } = ctx.request.query;

            const result = await coreEngineApi.getComplaintsByCustomer(
                customerId,
                parseInt(limit),
                parseInt(offset)
            );

            ctx.body = {
                success: true,
                data: result.complaints,
                total: result.total,
            };
        } catch (error) {
            ctx.status = 500;
            ctx.body = {
                success: false,
                message: error.message,
            };
        }
    }

    async getComplaintsByOrder(ctx) {
        try{
            const {orderId, limit = 50, offset = 0 } = ctx.request.query;

            const result = await coreEngineApi.getComplaintsByOrder(
                orderId,
                parseInt(limit),
                parseInt(offset)
            );

            ctx.body = {
                success: true,
                data: result.complaints,
                total: result.total,
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

module.exports = new ComplaintController();
