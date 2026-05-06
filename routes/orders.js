const Router = require('koa-router');
const ordersController = require('../controller/ordersController');
const { authorize } = require('../middleware');

const router = new Router({
  prefix: '/api/orders'
});

// Get all orders (with optional status filter)
router.get('/', authorize, ordersController.getOrders.bind(ordersController));

// Get order detail
router.get('/detail', authorize, ordersController.getOrderDetail.bind(ordersController));

// Update order status (approve, reject, etc.)
router.patch('/:orderId/status', authorize, ordersController.updateOrderStatus.bind(ordersController));

router.patch('/approve', authorize, ordersController.approveOrder.bind(ordersController));

router.patch('/reject', authorize, ordersController.rejectOrder.bind(ordersController));

module.exports = router;
