const Router = require('koa-router');
const inventoryController = require('../controller/inventoryController');
const { authorize } = require('../middleware');

const router = new Router({ prefix: '/inventory' });

router.get('/', authorize, inventoryController.getInventory.bind(inventoryController));

router.get('/:id', authorize, inventoryController.getInventoryById.bind(inventoryController));

router.post('/check-availability', authorize, inventoryController.checkAvailableQuantity.bind(inventoryController));

router.post('/reserve', authorize, inventoryController.reserveQuantity.bind(inventoryController));

router.post('/deduct', authorize, inventoryController.deductQuantity.bind(inventoryController));

router.post('/', authorize, inventoryController.createQuantity.bind(inventoryController));

router.post('/release', authorize, inventoryController.releaseReservedQuantity.bind(inventoryController));

router.post('/transfer', authorize, inventoryController.transferInventory.bind(inventoryController));

router.put('/', authorize, inventoryController.updateInventory.bind(inventoryController));

router.get('/history/movements', authorize, inventoryController.getMovementHistory.bind(inventoryController));

router.get('/low-stock', authorize, inventoryController.getLowStockProducts.bind(inventoryController));

router.get('/warehouse/:warehouseId/summary', authorize, inventoryController.getWarehouseSummary.bind(inventoryController));

router.delete('/', authorize, inventoryController.deleteInventory.bind(inventoryController));
module.exports = router;
