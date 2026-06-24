const coreEngineApi = require('../integration/coreEngineApi');

class CustomerController {

  async createCustomer(ctx) {
    try {
      const customerData = ctx.request.body;

      const result = await coreEngineApi.createCustomer(customerData);
      if (result.success) {
        ctx.status = 201;
      }
      else{
        ctx.status = 400;
      }
      ctx.body = result;
    } catch (error) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }

  async getCustomers(ctx) {
    try {
      const query = ctx.request.query;

      const result = await coreEngineApi.getCustomers(query);

      ctx.body = result;
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }

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

      const result = await coreEngineApi.getCustomerById(id);

      ctx.body = result;
    } catch (error) {
      ctx.status = 404;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }

  async updateCustomer(ctx) {
    try {
      const updates = ctx.request.body;
      const id = updates.id || ctx.request.body?.id || ctx.request.query?.id;
      
      if (!id) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: 'Customer ID is required',
        };
        return;
      }

      const result = await coreEngineApi.updateCustomer(id, updates);

      ctx.body = result;
    } catch (error) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }

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

      const result = await coreEngineApi.deleteCustomer(id);

      ctx.body = result;
    } catch (error) {
      ctx.status = 404;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }


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

      const result = await coreEngineApi.searchCustomers(term);

      ctx.body = result;
    } catch (error) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }

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

      const result = await coreEngineApi.getCustomersByZone(zoneId, query);

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
