const Router = require('koa-router');
const inventoryController = require('../controller/inventoryController');
const { authorize } = require('../middleware');

const router = new Router({ prefix: '/inventory' });

router.get('/', authorize, inventoryController.getInventory.bind(inventoryController));

router.get('/:id', authorize, inventoryController.getInventoryById.bind(inventoryController));

router.post('/', authorize, inventoryController.createQuantity.bind(inventoryController));

router.put('/', authorize, inventoryController.updateInventory.bind(inventoryController));

router.delete('/', authorize, inventoryController.deleteInventory.bind(inventoryController));
module.exports = router;
