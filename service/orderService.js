const coreEngineApi = require('../integration/coreEngineApi');
class OrderService {
  constructor(emailService) {
    this.emailService = emailService;
  }
  async approve(query){
      const { approvedBy, note = '', orderId, userId, orderCode } = query; 
      const order_detail = await coreEngineApi.getOrderItems(orderId);
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
            reservedQty: item.inventory.reservedQty - item.quantity,
            userId: approvedBy
          })
        }
      }
      const result = await coreEngineApi.approveOrder(orderId, approvedBy, note,  updateData);
      if (result.success) {
        const username = 'Trung';
        const user_detail = await coreEngineApi.getUserById(userId);
        const emailId = await this.emailService.queueEmail({
          to: user_detail.data.email,
          subject: 'Your order has been approved',
          html: `
            <h1>Hello ${user_detail.data.fullName}!</h1>
            <p>You have a new order that has been approved.</p>
            <p>Order Code: ${orderCode}</p>
            <p>Please check your order details for more information.</p>
          `,
          text: `Your order ${orderCode} has been approved.`
        });
      }
      return result;
    }
  }

module.exports = OrderService;