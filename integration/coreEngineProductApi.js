const coreEngineApi = require('./coreEngineApi');

class CoreEngineProductApi {
  /**
   * Create a new product
   * @param {Object} productData - Product data
   * @returns {Promise<Object>} Created product
   */
  async createProduct(productData) {
    const response = await coreEngineApi.doRequest('/api/products', {
      method: 'post',
      payload: productData,
    });

    if (response.status !== 200 && response.status !== 201) {
      throw new Error(response.data?.message || 'Failed to create product');
    }

    return response.data;
  }

  /**
   * Get all products with pagination and filters
   * @param {Object} query - Query params { page, limit, category, status }
   * @returns {Promise<Object>} { data: products, pagination }
   */
  async getProducts(query) {
    const response = await coreEngineApi.doRequest('/api/products', {
      method: 'get',
      payload: query,
    });

    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Failed to fetch products');
    }

    return response.data;
  }

  /**
   * Get product by ID
   * @param {string} id - Product ID
   * @returns {Promise<Object>} Product object
   */
  async getProductById(id) {
    const response = await coreEngineApi.doRequest(`/api/products/${id}`, {
      method: 'get',
    });

    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Product not found');
    }

    return response.data;
  }

  /**
   * Update product
   * @param {string} id - Product ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated product
   */
  async updateProduct(id, updates) {
    const response = await coreEngineApi.doRequest(`/api/products/${id}`, {
      method: 'put',
      payload: updates,
    });

    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Failed to update product');
    }

    return response.data;
  }

  /**
   * Delete product
   * @param {string} id - Product ID
   * @returns {Promise<Object>} Deleted product
   */
  async deleteProduct(id) {
    const response = await coreEngineApi.doRequest(`/api/products/${id}`, {
      method: 'delete',
    });

    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Failed to delete product');
    }

    return response.data;
  }

  /**
   * Get products by SKU
   * @param {Array} skus - Array of SKU codes
   * @returns {Promise<Object>} Products matching SKUs
   */
  async getProductsBySKU(skus) {
    const response = await coreEngineApi.doRequest('/api/products/search/by-sku', {
      method: 'post',
      payload: { skus },
    });

    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Failed to fetch products by SKU');
    }

    return response.data;
  }

  /**
   * Get products by category
   * @param {string} categoryId - Category ID
   * @param {Object} query - Query params { page, limit }
   * @returns {Promise<Object>} { data: products, pagination }
   */
  async getProductsByCategory(categoryId, query = {}) {
    const response = await coreEngineApi.doRequest(`/api/products/category/${categoryId}`, {
      method: 'get',
      payload: query,
    });

    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Failed to fetch products by category');
    }

    return response.data;
  }

  /**
   * Search products
   * @param {Object} query - Search query { search, page, limit, filters }
   * @returns {Promise<Object>} { data: products, pagination }
   */
  async searchProducts(query) {
    const response = await coreEngineApi.doRequest('/api/products/search/query', {
      method: 'get',
      payload: query,
    });

    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Failed to search products');
    }

    return response.data;
  }

  /**
   * Activate product
   * @param {string} id - Product ID
   * @returns {Promise<Object>} Updated product
   */
  async activateProduct(id) {
    const response = await coreEngineApi.doRequest(`/api/products/${id}/activate`, {
      method: 'patch',
    });

    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Failed to activate product');
    }

    return response.data;
  }

  /**
   * Deactivate product
   * @param {string} id - Product ID
   * @returns {Promise<Object>} Updated product
   */
  async deactivateProduct(id) {
    const response = await coreEngineApi.doRequest(`/api/products/${id}/deactivate`, {
      method: 'patch',
    });

    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Failed to deactivate product');
    }

    return response.data;
  }
}

// Singleton instance
const coreEngineProductApi = new CoreEngineProductApi();

module.exports = coreEngineProductApi;
