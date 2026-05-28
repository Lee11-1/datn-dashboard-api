const coreEngineApi = require('../integration/coreEngineApi');

class DashboardService {
  /**
   * Get dashboard statistics (revenue, order count, etc.)
   */
  async getStatistics(query = {}) {
    try {
      const { fromDate, toDate } = query;
      
      const ordersResult = await coreEngineApi.getOrders({
        limit: 10000,
        page: 1
      });

      const orders = ordersResult.data || [];
      
      let filteredOrders = orders;
      if (fromDate || toDate) {
        filteredOrders = orders.filter(order => {
          const orderDate = new Date(order.createdAt);
          if (fromDate && new Date(fromDate) > orderDate) return false;
          if (toDate && new Date(toDate) < orderDate) return false;
          return true;
        });
      }

      const totalRevenue = filteredOrders.reduce((sum, order) => 
        sum + parseFloat(order.finalAmount || 0), 0
      );

      const monthlyData = {};
      filteredOrders.forEach(order => {
        const date = new Date(order.createdAt);
        const monthKey = `${date.getMonth() + 1}/${date.getFullYear()}`;
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = 0;
        }
        monthlyData[monthKey] += parseFloat(order.finalAmount || 0);
      });

      const sortedMonths = Object.keys(monthlyData).sort((a, b) => {
        const [aMonth, aYear] = a.split('/').map(Number);
        const [bMonth, bYear] = b.split('/').map(Number);
        if (aYear !== bYear) return aYear - bYear;
        return aMonth - bMonth;
      });

      return {
        totalRevenue: Math.round(totalRevenue),
        totalOrders: filteredOrders.length,
        monthlyData: sortedMonths.map(month => ({
          month: month,
          amount: monthlyData[month]
        })),
        ordersByStatus: {
          approved: filteredOrders.filter(o => o.status === 'approved').length,
          rejected: filteredOrders.filter(o => o.status === 'rejected').length,
          pending: filteredOrders.filter(o => o.status === 'pending').length,
          cancelled: filteredOrders.filter(o => o.status === 'cancelled').length
        }
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get top 3 employees by revenue
   */
  async getTopEmployeesByRevenue(query = {}) {
    try {
      const { fromDate, toDate } = query;
      
      // Get all approved orders
      const ordersResult = await coreEngineApi.getOrders({
        status: 'approved',
        limit: 10000,
        page: 1
      });

      const orders = ordersResult.data || [];

      // Filter by date if provided
      let filteredOrders = orders;
      if (fromDate || toDate) {
        filteredOrders = orders.filter(order => {
          const orderDate = new Date(order.createdAt);
          if (fromDate && new Date(fromDate) > orderDate) return false;
          if (toDate && new Date(toDate) < orderDate) return false;
          return true;
        });
      }

      // Group by user
      const employeeRevenue = {};
      const employeeDetails = {};

      for (const order of filteredOrders) {
        if (!order.userId) continue;

        if (!employeeRevenue[order.userId]) {
          employeeRevenue[order.userId] = 0;
          // Get user details
          const userResult = await coreEngineApi.getUserById(order.userId);
          if (userResult.data) {
            employeeDetails[order.userId] = userResult.data;
          }
        }
        employeeRevenue[order.userId] += parseFloat(order.finalAmount || 0);
      }

      // Sort and get top 3
      const topEmployees = Object.entries(employeeRevenue)
        .map(([userId, revenue]) => ({
          userId,
          revenue: Math.round(revenue),
          ...employeeDetails[userId]
        }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 3);

      // Get zone info for each employee
      const topEmployeesWithZone = await Promise.all(
        topEmployees.map(async (emp) => {
          try {
            // Get schedules for user to find their zone
            const schedulesResult = await coreEngineApi.getSchedules({
              userId: emp.userId,
              limit: 1
            });
            
            const zone = schedulesResult.data?.[0]?.zone || null;
            return {
              ...emp,
              zone: zone
            };
          } catch (error) {
            return {
              ...emp,
              zone: null
            };
          }
        })
      );

      return topEmployeesWithZone;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get top 3 customers by zone
   */
  async getTopCustomersByZone(zoneId, query = {}) {
    try {
      const { fromDate, toDate } = query;

      // Call core engine API to get orders grouped by customer with customer data
      const payload = {
        status: 'approved',
        ...(fromDate && { startDate: fromDate }),
        ...(toDate && { endDate: toDate })
      };

      const response = await coreEngineApi.getOrdersByZoneWithCustomers(zoneId, payload);
      const allCustomers = (response.data.data|| response.data || response || []);

      const topCustomers = allCustomers
        .slice(0, 3)
        .map((customer, index) => ({
          rank: index + 1,
          ...customer
        }));

      return topCustomers;
    } catch (error) {
      throw error;
    }
  }

  async getZones(query = {}) {
    try {
      const { search_text, limit = 100, page = 1 } = query;
      
      const payload = {
        search_text: search_text || '',
        limit: limit,
        page: page,
        includeGeometry: 'false'
      };

      const zonesResult = await coreEngineApi.getZones(payload);
      
      let zones = zonesResult.data || [];
      
      // If it's paginated, get the zones array
      if (zonesResult.zones) {
        zones = zonesResult.zones;
      }

      return zones;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get zone with all customers and their coordinates
   */
  async getZoneWithCustomers(zoneId) {
    try {
      // Get customers in zone
      const customersResult = await coreEngineApi.getCustomersByZone(zoneId);
      const customers = customersResult.data || [];

      return {
        zone: {
          id: zoneId,
          name: 'Zone ' + zoneId
        },
        customers: customers.map(c => ({
          id: c.id,
          fullName: c.fullName || '',
          phone: c.phone || '',
          email: c.email || '',
          address: c.address || '',
          latitude: c.latitude || 0,
          longitude: c.longitude || 0,
          coordinates: (c.latitude && c.longitude) ? {
            type: 'Point',
            coordinates: [c.longitude, c.latitude]
          } : null
        }))
      };
    } catch (error) {
      console.error('Error getting zone with customers:', error);
      throw error;
    }
  }
}

module.exports = DashboardService;
