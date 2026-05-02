const Router = require('koa-router');
const warehouseController = require('../controller/warehouseController');
const { authorize, authorizeRole } = require('../middleware');

const router = new Router({
  prefix: '/api/warehouses'
});

router.post('/', authorize, warehouseController.createWarehouse.bind(warehouseController));

router.post('/bulk/create', authorize, warehouseController.bulkCreateWarehouses.bind(warehouseController));

router.get('/search', authorize, warehouseController.searchWarehouses.bind(warehouseController));

router.get('/stats/overview', authorize, warehouseController.getWarehouseStatistics.bind(warehouseController));

router.get('/', authorize, warehouseController.getWarehouses.bind(warehouseController));

router.get('/code/:code', authorize, warehouseController.getWarehouseByCode.bind(warehouseController));

router.get('/zone/:zoneId', authorize, warehouseController.getWarehousesByZone.bind(warehouseController));

router.get('/manager/:managerId', authorize, warehouseController.getWarehousesByManager.bind(warehouseController));

router.get('/:id', authorize, warehouseController.getWarehouseById.bind(warehouseController));

router.put('/:id', authorize, warehouseController.updateWarehouse.bind(warehouseController));

router.patch('/:id/status', authorize, warehouseController.toggleWarehouseStatus.bind(warehouseController));

router.patch('/:id/manager/assign', authorize, warehouseController.assignManager.bind(warehouseController));

router.patch('/:id/manager/remove', authorize, warehouseController.removeManager.bind(warehouseController));

router.patch('/:id/zone/assign', authorize, warehouseController.assignZone.bind(warehouseController));

router.patch('/:id/zone/remove', authorize, warehouseController.removeZone.bind(warehouseController));

router.delete('/:id', authorize, warehouseController.deleteWarehouse.bind(warehouseController));

module.exports = router;
