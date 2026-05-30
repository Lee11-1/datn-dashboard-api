const Router = require('koa-router');
const scheduleController = require('../controller/scheduleController');
const { authorize, authorizeRole } = require('../middleware');

const router = new Router({
  prefix: '/api/schedules'
});

router.post('/', authorize, scheduleController.createSchedule.bind(scheduleController));

router.get('/', authorize, scheduleController.getSchedules.bind(scheduleController));

router.get('/get-by-id', authorize, scheduleController.getScheduleById.bind(scheduleController));

router.get('/zone-analytics', authorize, scheduleController.getScheduleZoneAnalytics.bind(scheduleController));

router.get('/detail', authorize, scheduleController.getScheduleDetail.bind(scheduleController));

router.get('/zone/:zoneId', authorize, scheduleController.getSchedulesByZone.bind(scheduleController));

router.get('/user/:userId', authorize, scheduleController.getSchedulesByUser.bind(scheduleController));

router.put('/', authorize, scheduleController.updateSchedule.bind(scheduleController));

router.delete('/:id', authorize, scheduleController.deleteSchedule.bind(scheduleController));

module.exports = router;
