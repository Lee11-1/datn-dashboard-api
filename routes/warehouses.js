const Router = require('koa-router');
const warehouseController = require('../controller/warehouseController');
const { authorize, authorizeRole } = require('../middleware');

const router = new Router({
  prefix: '/api/warehouses'
});

router.post('/', authorize, warehouseController.createWarehouse.bind(warehouseController));

router.get('/', authorize, warehouseController.getWarehouses.bind(warehouseController));

router.put('/', authorize, warehouseController.updateWarehouse.bind(warehouseController));

router.delete('/', authorize, warehouseController.deleteWarehouse.bind(warehouseController));

module.exports = router;
