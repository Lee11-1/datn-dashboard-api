const Router = require('koa-router');
const customerController = require('../controller/customerController');

const router = new Router({ prefix: '/api/customers' });

router.post('/', customerController.createCustomer.bind(customerController));

router.get('/', customerController.getCustomers.bind(customerController));

router.get('/search/:term', customerController.searchCustomers.bind(customerController));

router.get('/zone/:zoneId', customerController.getCustomersByZone.bind(customerController));

router.get('/:id', customerController.getCustomerById.bind(customerController));

router.put('/:id', customerController.updateCustomer.bind(customerController));

router.delete('/', customerController.deleteCustomer.bind(customerController));

module.exports = router;
