const Router = require('koa-router');
const zoneController = require('../controller/zoneController');
const { authorize, authorizeRole } = require('../middleware');

const router = new Router({
  prefix: '/api/geo-data-updates'
});

router.get('/', authorize, authorizeRole(['admin']), zoneController.getGeoDataUpdates.bind(zoneController));

router.post('/sync', authorize, authorizeRole(['admin']), zoneController.triggerGeoDataSync.bind(zoneController));

router.get('/status', authorize, authorizeRole(['admin']), zoneController.getSyncStatus.bind(zoneController));

module.exports = router;
