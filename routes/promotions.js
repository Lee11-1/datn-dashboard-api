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
router.get('/zone/:zoneId', authorize, promotionController.getPromotionsByZone.bind(promotionController));
router.get('/:id', authorize, promotionController.getPromotionById.bind(promotionController));
router.put('/:id', authorize, promotionController.updatePromotion.bind(promotionController));
router.delete('/:id', authorize, promotionController.deletePromotion.bind(promotionController));
router.patch('/:id/status', authorize, promotionController.updateStatus.bind(promotionController));
router.post('/bulk/status', authorize, promotionController.bulkUpdateStatus.bind(promotionController));

module.exports = router;
