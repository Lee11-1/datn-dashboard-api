const coreEngineApi = require('../integration/coreEngineApi');
class WarehouseController {

  async createWarehouse(ctx) {
    try {
      const warehouseData = ctx.request.body;

      if (!warehouseData.name || !warehouseData.code) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: 'Missing required fields: name, code'
        };
        return;
      }

      const result = await coreEngineApi.createWarehouse(warehouseData);

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

  async getWarehouses(ctx) {
    try {
      const result = await coreEngineApi.getWarehouses(ctx.request.query);

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

  async updateWarehouse(ctx) {
    try {
      const updateData = ctx.request.body;

      const result = await coreEngineApi.updateWarehouse(updateData.id, updateData);

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

  async deleteWarehouse(ctx) {
    try {
      const { id } = ctx.params;
      const result = await coreEngineApi.deleteWarehouse(id);

      ctx.body = {
        success: true,
        data: result.data || result,
        message: 'Warehouse deleted successfully'
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

module.exports = new WarehouseController();
