const coreEngineCategoryApi = require('../integration/coreEngineCategoryApi');

class CategoryController {
  async createCategory(ctx) {
    try {
      const categoryData = ctx.request.body;
      const result = await coreEngineCategoryApi.createCategory(categoryData);

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
      const result = await coreEngineCategoryApi.getCategories(ctx.query);

      ctx.body = result.data;
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }

  async getCategoryTree(ctx) {
    try {
      const tree = await coreEngineCategoryApi.getCategoryTree();

      ctx.body = tree;
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }

  async getRootCategories(ctx) {
    try {
      const result = await coreEngineCategoryApi.getRootCategories(ctx.query);

      ctx.body = result.data;
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }

  async getCategoryById(ctx) {
    try {
      const { id } = ctx.request.body || ctx.query;

      if (!id) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: 'Category ID is required',
        };
        return;
      }

      const category = await coreEngineCategoryApi.getCategoryById(id);

      ctx.body = category;
    } catch (error) {
      ctx.status = 404;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }

  async getChildCategories(ctx) {
    try {
      const { parentId } = ctx.request.body || ctx.query;

      if (!parentId) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: 'Parent category ID is required',
        };
        return;
      }

      const result = await coreEngineCategoryApi.getChildCategories(parentId, ctx.query);

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

      const updatedCategory = await coreEngineCategoryApi.updateCategory(id, updates);

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
      const { id } = ctx.request.body || ctx.query;

      if (!id) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: 'Category ID is required',
        };
        return;
      }

      const result = await coreEngineCategoryApi.deleteCategory(id);

      ctx.body = result.data;
    } catch (error) {
      ctx.status = 404;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }

  async activateCategory(ctx) {
    try {
      const { id } = ctx.request.body || ctx.query;

      if (!id) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: 'Category ID is required',
        };
        return;
      }

      const category = await coreEngineCategoryApi.activateCategory(id);

      ctx.body = category;
    } catch (error) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }

  async deactivateCategory(ctx) {
    try {
      const { id } = ctx.request.body || ctx.query;

      if (!id) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: 'Category ID is required',
        };
        return;
      }

      const category = await coreEngineCategoryApi.deactivateCategory(id);

      ctx.body = category;
    } catch (error) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }

  async reorderCategories(ctx) {
    try {
      const { id, ...orderData } = ctx.request.body;

      if (!id) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: 'Category ID is required',
        };
        return;
      }

      const category = await coreEngineCategoryApi.reorderCategories(id, orderData);

      ctx.body = category;
    } catch (error) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }
}

module.exports = new CategoryController();
