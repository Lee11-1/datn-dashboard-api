const Router = require('koa-router');
const DashboardController = require('../controller/dashboardController');
const { authorize, authorizeRole } = require('../middleware');

const dashboardController = new DashboardController();

const router = new Router({
  prefix: '/api/dashboard'
});

// Statistics endpoints
router.get('/statistics', authorize, dashboardController.getStatistics.bind(dashboardController));

router.get('/top-employees', authorize, dashboardController.getTopEmployees.bind(dashboardController));

router.get('/zones', authorize, dashboardController.getZones.bind(dashboardController));

router.get('/zone/:zoneId/top-customers', authorize, dashboardController.getTopCustomersByZone.bind(dashboardController));

router.get('/zone/:zoneId/customers', authorize, dashboardController.getZoneWithCustomers.bind(dashboardController));

module.exports = router;
