const Router = require('koa-router');
const userController = require('../controller/userController');
const { authorize, authorizeRole } = require('../middleware');

const router = new Router({
  prefix: '/api/users'
});

router.post('/', authorize, authorizeRole(['admin']), userController.createUser.bind(userController));

router.get('/', authorize, authorizeRole(['admin', 'manager']), userController.getUsers.bind(userController));

router.get('/get-by-id', authorize, authorizeRole(['admin', 'sale', 'manager']), userController.getUserById.bind(userController));

router.put('/', authorize, authorizeRole(['admin']), userController.updateUser.bind(userController));

router.delete('/', authorize, authorizeRole(['admin']), userController.deleteUser.bind(userController));

module.exports = router;
