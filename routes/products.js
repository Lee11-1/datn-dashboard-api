const Router = require('koa-router');
const productController = require('../controller/productControllers');
const { authorize, authorizeRole } = require('../middleware');

const router = new Router({
  prefix: '/api/products'
});

router.post('/', authorize, productController.createProduct.bind(productController));

router.get('/', authorize, productController.getProducts.bind(productController));

router.get('/get-by-id', authorize, productController.getProductById.bind(productController));

router.post('/search/by-sku', authorize, productController.getProductsBySKU.bind(productController));

router.post('/category', authorize, productController.getProductsByCategory.bind(productController));

router.get('/search', authorize, productController.searchProducts.bind(productController));

router.put('/', authorize, productController.updateProduct.bind(productController));

router.delete('/', authorize, productController.deleteProduct.bind(productController));

router.patch('/activate', authorize, productController.activateProduct.bind(productController));

router.patch('/deactivate', authorize, productController.deactivateProduct.bind(productController));

router.get('/detail', authorize, productController.getProductDetails.bind(productController));

router.put('/detail', authorize, productController.updateProductDetails.bind(productController));


module.exports = router;
