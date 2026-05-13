const coreEngineApi = require('../integration/coreEngineApi');

class CategoryController {
  async createCategory(ctx) {
    try {
      const categoryData = ctx.request.body;
      const result = await coreEngineApi.createCategory(categoryData);

      ctx.status = 201;
      ctx.body = result.data;
    } catch (error) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }

  async getCategories(ctx) {
    try {
      const result = await coreEngineApi.getCategories(ctx.request.query);
      ctx.body = result.data;
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }

  async updateCategory(ctx) {
    try {
      const { id, ...updates } = ctx.request.body;

      if (!id) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: 'Category ID is required',
        };
        return;
      }

      const updatedCategory = await coreEngineApi.updateCategory(id, updates);

      ctx.body = updatedCategory;
    } catch (error) {
      ctx.status = 404;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }

  async deleteCategory(ctx) {
    try {
      const category_id = ctx.request.body?.category_id ?? ctx.request.query?.category_id;
      if (!category_id) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: 'Category ID is required',
        };
        return;
      }

      const result = await coreEngineApi.deleteCategory(category_id);

      ctx.body = result;
    } catch (error) {
      ctx.status = 404;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }
}

module.exports = new CategoryController();
