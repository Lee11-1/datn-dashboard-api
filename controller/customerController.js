const coreEngineCustomerApi = require('../integration/coreEngineCustomerApi');

class CustomerController {
  /**
   * Create a new customer
   * POST /api/customers
   */
  async createCustomer(ctx) {
    try {
      const customerData = ctx.request.body;

      const result = await coreEngineCustomerApi.createCustomer(customerData);

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

  /**
   * Get all customers with filtering and pagination
   * GET /api/customers?limit=10&offset=0&phone=...&email=...&zoneId=...
   */
  async getCustomers(ctx) {
    try {
      const query = ctx.request.query;

      const result = await coreEngineCustomerApi.getCustomers(query);

      ctx.body = result;
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Get customer by ID
   * GET /api/customers/:id
   */
  async getCustomerById(ctx) {
    try {
      const { id } = ctx.params;

      if (!id) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: 'Customer ID is required',
        };
        return;
      }

      const result = await coreEngineCustomerApi.getCustomerById(id);

      ctx.body = result;
    } catch (error) {
      ctx.status = 404;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Update customer
   * PUT /api/customers/:id
   */
  async updateCustomer(ctx) {
    try {
      const { id } = ctx.params;
      const updates = ctx.request.body;

      if (!id) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: 'Customer ID is required',
        };
        return;
      }

      const result = await coreEngineCustomerApi.updateCustomer(id, updates);

      ctx.body = result;
    } catch (error) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Delete customer
   * DELETE /api/customers/:id
   */
  async deleteCustomer(ctx) {
    try {
      const id  = ctx.request.body?.id || ctx.request.query?.id;

      if (!id) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: 'Customer ID is required',
        };
        return;
      }

      const result = await coreEngineCustomerApi.deleteCustomer(id);

      ctx.body = result;
    } catch (error) {
      ctx.status = 404;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Search customers
   * GET /api/customers/search/:term
   */
  async searchCustomers(ctx) {
    try {
      const { term } = ctx.params;

      if (!term) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: 'Search term is required',
        };
        return;
      }

      const result = await coreEngineCustomerApi.searchCustomers(term);

      ctx.body = result;
    } catch (error) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Get customers by zone
   * GET /api/customers/zone/:zoneId
   */
  async getCustomersByZone(ctx) {
    try {
      const { zoneId } = ctx.params;
      const query = ctx.request.query;

      if (!zoneId) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: 'Zone ID is required',
        };
        return;
      }

      const result = await coreEngineCustomerApi.getCustomersByZone(zoneId, query);

      ctx.body = result;
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }
}

module.exports = new CustomerController();
