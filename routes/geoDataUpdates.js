const Router = require('koa-router');
const zoneController = require('../controller/zoneController');
const { authorize, authorizeRole } = require('../middleware');

const router = new Router({
  prefix: '/api/geo-data-updates'
});

router.get('/', zoneController.getGeoDataUpdates.bind(zoneController));

router.get('/latest', zoneController.getLatestGeoDataUpdate.bind(zoneController));

router.post('/sync',authorize, zoneController.triggerGeoDataSync.bind(zoneController));

router.get('/status', zoneController.getSyncStatus.bind(zoneController));

module.exports = router;
