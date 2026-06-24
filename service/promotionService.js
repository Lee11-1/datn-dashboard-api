const coreEngineApi = require('../integration/coreEngineApi');

class PromotionService {
  async createPromotion(promotionData) {
    const response = await coreEngineApi.createPromotion(promotionData);

    if (!response.success) {
      throw new Error(response.message || 'Failed to create promotion');
    }

    return response.data;
  }

  async getPromotions(query) {
    const response = await coreEngineApi.getPromotions(query);
    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch promotions');
    }

    return {
      data: response.data,
      pagination: response.pagination,
    };
  }

  async getPromotionById(id) {
    const response = await coreEngineApi.getPromotionById(id);

    if (!response.success) {
      throw new Error(response.message || 'Promotion not found');
    }

    return response.data;
  }

  async updatePromotion(id, promotionData) {
    const response = await coreEngineApi.updatePromotion(id, promotionData);

    if (!response.success) {
      throw new Error(response.message || 'Failed to update promotion');
    }

    return response.data;
  }

  async deletePromotion(id) {
    const response = await coreEngineApi.deletePromotion(id);

    if (!response.success) {
      throw new Error(response.message || 'Failed to delete promotion');
    }

    return response.data;
  }

  async getActivePromotions() {
    const response = await coreEngineApi.getActivePromotions();

    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch active promotions');
    }

    return response.data;
  }

  async getPromotionsByZone(zoneId, query) {
    const response = await coreEngineApi.getPromotionsByZone(zoneId, query);

    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch zone promotions');
    }

    return {
      data: response.data,
      pagination: response.pagination,
    };
  }

  async searchPromotions(query) {
    return await this.getPromotions(query);
  }
}

module.exports = new PromotionService();
