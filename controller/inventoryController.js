const coreEngineApi = require('../integration/coreEngineApi');

class InventoryController {

  async getInventory(ctx) {
    try {
      const result = await coreEngineApi.getInventory(ctx.request.query);

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

 
  async getInventoryById(ctx) {
    try {
      const { id } = ctx.params;
      const result = await coreEngineApi.getInventoryById(id);

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

  async createQuantity(ctx) {
    try {
      const data = ctx.request.body;

      if (!data.productId || !data.warehouseId || data.quantity === undefined || !data.userId) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: 'Missing required fields: productId, warehouseId, quantity, userId'
        };
        return;
      }
        if (data.quantity <= 0) {
            ctx.status = 400;
            ctx.body = {
            success: false,
            message: 'Quantity must be greater than 0',
            };
            return;
        }

      const result = await coreEngineApi.createQuantity(data);

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

  async deleteInventory(ctx){
    const { id, userId } = ctx.request.query;
    if (!id) {  
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: 'Missing required field: id'
        };
        return;
    }
    try {      
        const payload = { id, userId };
        const result = await coreEngineApi.deleteInventory(payload);
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

 
  async updateInventory(ctx) {
    try {
      const updateData = ctx.request.body;

      if (!updateData.id) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: 'Missing required field: id'
        };
        return;
      }

      const result = await coreEngineApi.updateInventory(updateData.id, updateData);

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
}

module.exports = new InventoryController();
