const Router = require('koa-router');
const zoneController = require('../controller/zoneController');
const { authorize, authorizeRole } = require('../middleware');

const router = new Router({
  prefix: '/api/zones'
});

router.post('/',authorize, zoneController.createZone.bind(zoneController));
router.get('/',authorize, zoneController.getZones.bind(zoneController));
router.put('/:id',authorize, zoneController.updateZone.bind(zoneController));
router.delete('/:id',authorize, zoneController.deleteZone.bind(zoneController));


module.exports = router;
