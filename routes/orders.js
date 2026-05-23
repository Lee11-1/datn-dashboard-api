const Router = require('koa-router');
const ordersController = require('../controller/ordersController');
const { authorize } = require('../middleware');

const router = new Router({
  prefix: '/api/orders'
});

router.get('/', authorize, ordersController.getOrders.bind(ordersController));

router.get('/detail', authorize, ordersController.getOrderDetail.bind(ordersController));

router.patch('/:orderId/status', authorize, ordersController.updateOrderStatus.bind(ordersController));

router.patch('/approve', authorize, ordersController.approveOrder.bind(ordersController));

router.patch('/reject', authorize, ordersController.rejectOrder.bind(ordersController));

router.get('/user', authorize, ordersController.getOrdersByUser);

router.get('/schedule', authorize,   ordersController.getOrdersBySchedule);

module.exports = router;
