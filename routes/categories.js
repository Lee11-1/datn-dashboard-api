const Router = require('koa-router');
const categoryController = require('../controller/categoryController');
const { authorize, authorizeRole } = require('../middleware');

const router = new Router({
  prefix: '/api/categories'
});

router.post('/', authorize, categoryController.createCategory.bind(categoryController));

router.get('/', authorize, categoryController.getCategories.bind(categoryController));

router.put('/', authorize, categoryController.updateCategory.bind(categoryController));

router.delete('/', authorize, categoryController.deleteCategory.bind(categoryController));

module.exports = router;
