const Router = require('koa-router');
const scheduleController = require('../controller/scheduleController');
const { authorize, authorizeRole } = require('../middleware');

const router = new Router({
  prefix: '/api/schedules'
});

router.post('/', authorize, scheduleController.createSchedule.bind(scheduleController));

router.get('/', authorize, scheduleController.getSchedules.bind(scheduleController));

router.get('/stats/overview', authorize, scheduleController.getStatistics.bind(scheduleController));

router.get('/date/:date', authorize, scheduleController.getSchedulesByDate.bind(scheduleController));

router.get('/zone/:zoneId', authorize, scheduleController.getSchedulesByZone.bind(scheduleController));

router.get('/user/:userId', authorize, scheduleController.getSchedulesByUser.bind(scheduleController));

router.get('/:id', authorize, scheduleController.getScheduleById.bind(scheduleController));

router.put('/', authorize, scheduleController.updateSchedule.bind(scheduleController));

router.patch('/:id/status', authorize, scheduleController.changeScheduleStatus.bind(scheduleController));

router.patch('/:id/warehouse', authorize, scheduleController.assignScheduleToWarehouse.bind(scheduleController));

router.delete('/:id', authorize, scheduleController.deleteSchedule.bind(scheduleController));

module.exports = router;
