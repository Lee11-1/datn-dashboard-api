const Router = require('koa-router');
const scheduleController = require('../controller/scheduleController');
const { authorize, authorizeRole } = require('../middleware');

const router = new Router({
  prefix: '/api/schedules'
});

router.post('/', authorize, scheduleController.createSchedule.bind(scheduleController));

// Get all schedules with filters
router.get('/', authorize, scheduleController.getSchedules.bind(scheduleController));

// Get schedule statistics
router.get('/stats/overview', authorize, scheduleController.getStatistics.bind(scheduleController));

// Get schedules by date
router.get('/date/:date', authorize, scheduleController.getSchedulesByDate.bind(scheduleController));

// Get schedules by zone
router.get('/zone/:zoneId', authorize, scheduleController.getSchedulesByZone.bind(scheduleController));

// Get schedules by user
router.get('/user/:userId', authorize, scheduleController.getSchedulesByUser.bind(scheduleController));

// Get schedule by ID
router.get('/:id', authorize, scheduleController.getScheduleById.bind(scheduleController));

// Update schedule
router.put('/:id', authorize, scheduleController.updateSchedule.bind(scheduleController));

// Change schedule status
router.patch('/:id/status', authorize, scheduleController.changeScheduleStatus.bind(scheduleController));

// Assign schedule to warehouse
router.patch('/:id/warehouse', authorize, scheduleController.assignScheduleToWarehouse.bind(scheduleController));

// Delete schedule
router.delete('/:id', authorize, scheduleController.deleteSchedule.bind(scheduleController));

module.exports = router;
