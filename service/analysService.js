const coreEngineApi = require('../integration/coreEngineApi');

module.exports = {

  getScheduleZoneAnalytics: async (query) => {
    try {
      const { zoneId, startDate, endDate } = query;

      const customersResponse = await coreEngineApi.getTopCustomersOrderByZone(
            zoneId , startDate, endDate 
      )

      const statsResponse = await coreEngineApi.getOrderStatistics({ zoneId, startDate, endDate })

      return {
        customers: customersResponse.data ? customersResponse.data : [],
        orderStats: statsResponse.data ? statsResponse.data : []
      }
    } catch (error) {
      console.error('Error getting schedule zone analytics:', error)
      throw error
    }
  }
}
