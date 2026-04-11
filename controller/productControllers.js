const coreEngineProductApi = require('../integration/coreEngineProductApi');

class ProductController {
  async createProduct(ctx) {
    try {
      const productData = ctx.request.body;
      const result = await coreEngineProductApi.createProduct(productData);

      ctx.status = 201;
      ctx.body = result;
    } catch (error) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }

  async getProducts(ctx) {
    try {
      const result = await coreEngineProductApi.getProducts(ctx.query);

      ctx.body = result;
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }

  async getProductById(ctx) {
    try {
      const { id } = ctx.request.body || ctx.query;

      if (!id) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: 'Product ID is required',
        };
        return;
      }

      const product = await coreEngineProductApi.getProductById(id);

      ctx.body = product;
    } catch (error) {
      ctx.status = 404;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }

  async updateProduct(ctx) {
    try {
      const { id, ...updates } = ctx.request.body;

      if (!id) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: 'Product ID is required',
        };
        return;
      }

      const updatedProduct = await coreEngineProductApi.updateProduct(id, updates);

      ctx.body = updatedProduct;
    } catch (error) {
      ctx.status = 404;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }

  async deleteProduct(ctx) {
    try {
      const id  = ctx.request.body?.product_id || ctx.request.query.product_id;
      
      if (!id) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: 'Product ID is required',
        };
        return;
      }

      const result = await coreEngineProductApi.deleteProduct(id);

      ctx.body = result;
    } catch (error) {
      ctx.status = 404;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }

  async getProductsBySKU(ctx) {
    try {
      const { skus } = ctx.request.body;

      if (!skus || !Array.isArray(skus)) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: 'skus array is required in request body',
        };
        return;
      }

      const result = await coreEngineProductApi.getProductsBySKU(skus);

      ctx.body = result;
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }

  async getProductsByCategory(ctx) {
    try {
      const { categoryId } = ctx.request.body || ctx.query;

      if (!categoryId) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: 'Category ID is required',
        };
        return;
      }

      const result = await coreEngineProductApi.getProductsByCategory(categoryId, ctx.query);

      ctx.body = result;
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }

  async searchProducts(ctx) {
    try {
      const result = await coreEngineProductApi.searchProducts(ctx.query);

      ctx.body = result;
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }

  async activateProduct(ctx) {
    try {
      const { id } = ctx.request.body || ctx.query;

      if (!id) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: 'Product ID is required',
        };
        return;
      }

      const product = await coreEngineProductApi.activateProduct(id);

      ctx.body = product;
    } catch (error) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }

  async deactivateProduct(ctx) {
    try {
      const { id } = ctx.request.body || ctx.query;

      if (!id) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: 'Product ID is required',
        };
        return;
      }

      const product = await coreEngineProductApi.deactivateProduct(id);

      ctx.body = product;
    } catch (error) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }
}

module.exports = new ProductController();
