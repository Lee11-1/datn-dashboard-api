const coreEngineApi = require('./coreEngineApi');

class CoreEngineCategoryApi {
  /**
   * Create a new category
   * @param {Object} categoryData - Category data
   * @returns {Promise<Object>} Created category
   */
  async createCategory(categoryData) {
    const response = await coreEngineApi.doRequest('/api/categories', {
      method: 'post',
      payload: categoryData,
    });

    if (response.status !== 200 && response.status !== 201) {
      throw new Error(response.data?.message || 'Failed to create category');
    }

    return response.data;
  }

  /**
   * Get all categories with pagination and filters
   * @param {Object} query - Query params { page, limit, status }
   * @returns {Promise<Object>} { data: categories, pagination }
   */
  async getCategories(query) {
    const response = await coreEngineApi.doRequest('/api/categories', {
      method: 'get',
      payload: query,
    });

    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Failed to fetch categories');
    }

    return response.data;
  }

  /**
   * Get category tree structure
   * @returns {Promise<Object>} Category tree
   */
  async getCategoryTree() {
    const response = await coreEngineApi.doRequest('/api/categories/tree', {
      method: 'get',
    });

    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Failed to fetch category tree');
    }

    return response.data;
  }

  /**
   * Get root categories (no parent)
   * @param {Object} query - Query params { page, limit }
   * @returns {Promise<Object>} { data: categories, pagination }
   */
  async getRootCategories(query = {}) {
    const response = await coreEngineApi.doRequest('/api/categories/root', {
      method: 'get',
      payload: query,
    });

    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Failed to fetch root categories');
    }

    return response.data;
  }

  /**
   * Get category by ID
   * @param {string} id - Category ID
   * @returns {Promise<Object>} Category object
   */
  async getCategoryById(id) {
    const response = await coreEngineApi.doRequest(`/api/categories/${id}`, {
      method: 'get',
    });

    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Category not found');
    }

    return response.data;
  }

  /**
   * Get child categories
   * @param {string} parentId - Parent category ID
   * @param {Object} query - Query params { page, limit }
   * @returns {Promise<Object>} { data: categories, pagination }
   */
  async getChildCategories(parentId, query = {}) {
    const response = await coreEngineApi.doRequest(`/api/categories/${parentId}/children`, {
      method: 'get',
      payload: query,
    });

    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Failed to fetch child categories');
    }

    return response.data;
  }

  /**
   * Update category
   * @param {string} id - Category ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated category
   */
  async updateCategory(id, updates) {
    const response = await coreEngineApi.doRequest(`/api/categories/${id}`, {
      method: 'put',
      payload: updates,
    });

    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Failed to update category');
    }

    return response.data;
  }

  /**
   * Delete category
   * @param {string} id - Category ID
   * @returns {Promise<Object>} Deleted category
   */
  async deleteCategory(id) {
    const response = await coreEngineApi.doRequest(`/api/categories/${id}`, {
      method: 'delete',
    });

    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Failed to delete category');
    }

    return response.data;
  }

  /**
   * Activate category
   * @param {string} id - Category ID
   * @returns {Promise<Object>} Updated category
   */
  async activateCategory(id) {
    const response = await coreEngineApi.doRequest(`/api/categories/${id}/activate`, {
      method: 'patch',
    });

    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Failed to activate category');
    }

    return response.data;
  }

  /**
   * Deactivate category
   * @param {string} id - Category ID
   * @returns {Promise<Object>} Updated category
   */
  async deactivateCategory(id) {
    const response = await coreEngineApi.doRequest(`/api/categories/${id}/deactivate`, {
      method: 'patch',
    });

    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Failed to deactivate category');
    }

    return response.data;
  }

  /**
   * Reorder categories
   * @param {string} id - Category ID
   * @param {Object} orderData - Reorder data { newPosition, parentId }
   * @returns {Promise<Object>} Updated category
   */
  async reorderCategories(id, orderData) {
    const response = await coreEngineApi.doRequest(`/api/categories/${id}/reorder`, {
      method: 'patch',
      payload: orderData,
    });

    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Failed to reorder categories');
    }

    return response.data;
  }
}

// Singleton instance
const coreEngineCategoryApi = new CoreEngineCategoryApi();

module.exports = coreEngineCategoryApi;
