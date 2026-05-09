const coreEngineOrdersApi = require('../integration/ordersIntegration');
const coreEngineInventoryApi = require('../integration/coreEngineInventoryApi');

class OrderService {
  async approve(orderId, approvedBy, note){
      const order_detail = await coreEngineOrdersApi.getOrderItems(orderId);
      const data = order_detail.data
      let updateData = []
      for (const item of data) {
        if (!item.warehouseId) {
          throw new Error(`This product is not available in any warehouse`);
        }
        const quantity_available = item.inventory ? item.inventory.quantity : 0;
        if (quantity_available < item.quantity) {
          throw new Error(`Not enough stock for product ${item.productName} in warehouse ${item.warehouseId}. Available: ${quantity_available}, Required: ${item.quantity}`);
        }
        else{
          updateData.push({
            id: item.inventory.id,
            quantity: quantity_available - item.quantity,
            userId: approvedBy
          })
        }
      }
      const result_inventory = await coreEngineInventoryApi.updateInventories({inventories: updateData});
      if (result_inventory.success !== true)  {
        throw new Error(`Failed to update inventory for product ${item.productName} in warehouse ${item.warehouseId}`);
      }
      const result = await coreEngineOrdersApi.approveOrder(orderId, approvedBy, note);
      return result;
    }

  }


module.exports = new OrderService();
