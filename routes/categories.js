const Router = require('koa-router');
const categoryController = require('../controller/categoryController');
const { authorize, authorizeRole } = require('../middleware');

const router = new Router({
  prefix: '/api/categories'
});

// Create category
router.post('/', authorize, categoryController.createCategory.bind(categoryController));

// Get all categories
router.get('/', authorize, categoryController.getCategories.bind(categoryController));

// Get category tree structure
router.get('/tree', authorize, categoryController.getCategoryTree.bind(categoryController));

// Get root categories (no parent)
router.get('/root', authorize, categoryController.getRootCategories.bind(categoryController));

// Get category by ID (body or query: {id})
router.post('/get-by-id', authorize, categoryController.getCategoryById.bind(categoryController));

// Get child categories (body or query: {parentId})
router.post('/children', authorize, categoryController.getChildCategories.bind(categoryController));

// Update category (body: {id, ...updates})
router.put('/', authorize, categoryController.updateCategory.bind(categoryController));

// Delete category (body or query: {id})
router.delete('/', authorize, categoryController.deleteCategory.bind(categoryController));

// Activate category (body or query: {id})
router.patch('/activate', authorize, categoryController.activateCategory.bind(categoryController));

// Deactivate category (body or query: {id})
router.patch('/deactivate', authorize, categoryController.deactivateCategory.bind(categoryController));

// Reorder categories (body: {id, newPosition, parentId})
router.patch('/reorder', authorize, categoryController.reorderCategories.bind(categoryController));

module.exports = router;
