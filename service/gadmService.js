const axios = require('axios');

class GADMService {
  constructor() {
    // GADM API base URL format: https://geodata.ucdavis.edu/gadm/gadm4.1/json/gadm41_VNM_{level}.json
    this.baseUrl = 'https://geodata.ucdavis.edu/gadm/gadm4.1/json/gadm41';
    this.vietnamCode = 'VNM';
  }


  async fetchVietnamGeoData(level = 1) {
    try {
      const url = `${this.baseUrl}_${this.vietnamCode}_${level}.json`;
      
      console.log(`Fetching GADM data from: ${url}`);
      
      const response = await axios.get(url, {
        timeout: 30000
      });

      if (!response.data || !response.data.features) {
        throw new Error('Invalid GADM response: missing features');
      }

      console.log(`✅ Retrieved ${response.data.features.length} features from GADM`);
    
      const features = response.data.features.filter(feature => {
          const props = feature.properties || {};
          const name1 = props.NAME_1 
          return name1 === 'HàNội';
        });
      return features;
    } catch (error) {
      console.error(` Error fetching GADM data: ${error.message}`);
      throw new Error(`Failed to fetch GADM data: ${error.message}`);
    }
  }


  transformFeatureToZone(feature, level) {
    const props = feature.properties || {};

    const codeMapping = {
      0: 'GID_0', // Country code
      1: 'GID_1', // Province code
      2: 'GID_2', // District code
      3: 'GID_3'  // Ward code
    };

    const nameMapping = {
      0: 'COUNTRY',
      1: 'NAME_1',
      2: 'NAME_2',
      3: 'NAME_3'
    };

    const parentCodeMapping = {
      0: null,
      1: 'GID_0',
      2: 'GID_1',
      3: 'GID_2'
    };

    const code = props[codeMapping[level]];
    const name = props[nameMapping[level]] || props.NAME || 'Unknown';
    const parentCode = level > 0 ? props[parentCodeMapping[level]] : null;

    return {
      code,
      name,
      parentCode,
      level,
      geometry: feature.geometry,
      gadmId: code,
      properties: {
        ...props,
        source: 'GADM',
        fetchedAt: new Date().toISOString()
      },
      isActive: true
    };
  }

  async fetchProvinces() {
    return this.fetchVietnamGeoData(1);
  }

  async fetchDistricts() {
    return this.fetchVietnamGeoData(2);
  }


  async fetchWards() {
    return this.fetchVietnamGeoData(3);
  }
}

module.exports = new GADMService();
