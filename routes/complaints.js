const Router = require('koa-router');
const complaintController = require('../controller/complaintController');

const router = new Router({
  prefix: '/api/complaints'
});

router.get('/', complaintController.getComplaints.bind(complaintController));
router.put('/', complaintController.updateComplaint.bind(complaintController));
router.delete('/', complaintController.deleteComplaint.bind(complaintController));

router.get('/user', complaintController.getComplaintsByUser.bind(complaintController));
router.get('/customer', complaintController.getComplaintsByCustomer.bind(complaintController));
router.get('/order', complaintController.getComplaintsByOrder.bind(complaintController));
router.put('/status', complaintController.updateComplaintStatus.bind(complaintController));

module.exports = router;
