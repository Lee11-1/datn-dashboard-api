const Router = require('koa-router');
const zoneController = require('../controller/zoneController');
const { authorize, authorizeRole } = require('../middleware');

const router = new Router({
  prefix: '/api/zones'
});

router.post('/',authorize, zoneController.createZone.bind(zoneController));
router.get('/',authorize, zoneController.getZones.bind(zoneController));
router.get('/tree',authorize, zoneController.getZoneTree.bind(zoneController));
router.get('/by-code/:code',authorize, zoneController.getZoneByCode.bind(zoneController));
router.get('/by-level/:level',authorize, zoneController.getZonesByLevel.bind(zoneController));
router.get('/:id',authorize, zoneController.getZoneById.bind(zoneController));
router.put('/:id',authorize, zoneController.updateZone.bind(zoneController));
router.delete('/:id',authorize, zoneController.deleteZone.bind(zoneController));

router.get('/:parentId/children', zoneController.getChildZones.bind(zoneController));
router.patch('/:id/activate',authorize, zoneController.activateZone.bind(zoneController));
router.patch('/:id/deactivate',authorize, zoneController.deactivateZone.bind(zoneController));

module.exports = router;
