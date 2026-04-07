const Router = require('koa-router');
const userController = require('../controller/userController');
const { authorize, authorizeRole } = require('../middleware');

const router = new Router({
  prefix: '/api/users'
});

router.post('/', authorize, userController.createUser.bind(userController));

router.get('/', authorize, authorizeRole(['admin']), userController.getUsers.bind(userController));

router.post('/get-by-id', authorize, userController.getUserById.bind(userController));

router.put('/', authorize, userController.updateUser.bind(userController));

router.delete('/', authorize, userController.deleteUser.bind(userController));

module.exports = router;
