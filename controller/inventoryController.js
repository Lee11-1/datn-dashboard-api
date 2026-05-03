const coreEngineInventoryApi = require('../integration/coreEngineInventoryApi');

/**
 * Inventory controller to handle inventory-related API requests
 * All data operations are delegated to the core engine
 */
class InventoryController {
  /**
   * Get all inventory items with filters
   * GET /inventory
   */
  async getInventory(ctx) {
    try {
      const result = await coreEngineInventoryApi.getInventory(ctx.request.query);

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
   * Get inventory by ID
   * GET /inventory/:id
   */
  async getInventoryById(ctx) {
    try {
      const { id } = ctx.params;
      const result = await coreEngineInventoryApi.getInventoryById(id);

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
   * Check available quantity for a product
   * POST /inventory/check-availability
   */
  async checkAvailableQuantity(ctx) {
    try {
      const data = ctx.request.body;

      if (!data.productId || !data.warehouseId || data.quantity === undefined) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: 'Missing required fields: productId, warehouseId, quantity'
        };
        return;
      }

      const result = await coreEngineInventoryApi.checkAvailableQuantity(data);

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
   * Reserve quantity from inventory
   * POST /inventory/reserve
   */
  async reserveQuantity(ctx) {
    try {
      const data = ctx.request.body;

      if (!data.productId || !data.warehouseId || data.quantity === undefined) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: 'Missing required fields: productId, warehouseId, quantity'
        };
        return;
      }

      const result = await coreEngineInventoryApi.reserveQuantity(data);

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
   * Deduct quantity from inventory
   * POST /inventory/deduct
   */
  async deductQuantity(ctx) {
    try {
      const data = ctx.request.body;

      if (!data.productId || !data.warehouseId || data.quantity === undefined) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: 'Missing required fields: productId, warehouseId, quantity'
        };
        return;
      }

      const result = await coreEngineInventoryApi.deductQuantity(data);

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

      const result = await coreEngineInventoryApi.createQuantity(data);

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
        const result = await coreEngineInventoryApi.deleteInventory(payload);
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
   * Release reserved quantity
   * POST /inventory/release
   */
  async releaseReservedQuantity(ctx) {
    try {
      const data = ctx.request.body;

      if (!data.productId || !data.warehouseId || data.quantity === undefined) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: 'Missing required fields: productId, warehouseId, quantity'
        };
        return;
      }

      const result = await coreEngineInventoryApi.releaseReservedQuantity(data);

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
   * Transfer inventory between warehouses
   * POST /inventory/transfer
   */
  async transferInventory(ctx) {
    try {
      const data = ctx.request.body;

      if (!data.productId || !data.fromWarehouseId || !data.toWarehouseId || data.quantity === undefined) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: 'Missing required fields: productId, fromWarehouseId, toWarehouseId, quantity'
        };
        return;
      }

      const result = await coreEngineInventoryApi.transferInventory(data);

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
   * Get movement history
   * GET /inventory/history/movements
   */
  async getMovementHistory(ctx) {
    try {
      const result = await coreEngineInventoryApi.getMovementHistory(ctx.request.query);

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
   * Get low stock products
   * GET /inventory/low-stock
   */
  async getLowStockProducts(ctx) {
    try {
      const result = await coreEngineInventoryApi.getLowStockProducts(ctx.request.query);

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
   * Get warehouse inventory summary
   * GET /inventory/warehouse/:warehouseId/summary
   */
  async getWarehouseSummary(ctx) {
    try {
      const { warehouseId } = ctx.params;
      const result = await coreEngineInventoryApi.getWarehouseSummary(warehouseId, ctx.request.query);

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

      const result = await coreEngineInventoryApi.updateInventory(updateData.id, updateData);

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
