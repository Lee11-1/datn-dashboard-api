const coreEngineApi = require('../integration/coreEngineApi');

module.exports = {

  getScheduleZoneAnalytics: async (zoneId) => {
    try {
      const customersResponse = await coreEngineApi.getTopCustomersOrderByZone(
        zoneId
      )
      
      const statsResponse = await coreEngineApi.getOrderStatistics({zoneId: zoneId})
      
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
