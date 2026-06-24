const Router = require('koa-router');
const promotionController = require('../controller/promotionController');
const { authorize, authorizeRole } = require('../middleware');

const router = new Router({
  prefix: '/api/promotions'
});

router.post('/', authorize, promotionController.createPromotion.bind(promotionController));
router.get('/', authorize, promotionController.getPromotions.bind(promotionController));
router.get('/search', authorize, promotionController.searchPromotions.bind(promotionController));
router.get('/active', authorize, promotionController.getActivePromotions.bind(promotionController));
router.get('/zone', authorize, promotionController.getPromotionsByZone.bind(promotionController));
router.get('/get-by-id', authorize, promotionController.getPromotionById.bind(promotionController));
router.put('/', authorize, promotionController.updatePromotion.bind(promotionController));
router.delete('/', authorize, promotionController.deletePromotion.bind(promotionController));

module.exports = router;
