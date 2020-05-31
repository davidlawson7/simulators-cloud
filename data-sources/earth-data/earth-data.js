const { RESTDataSource } = require('apollo-datasource-rest');
const EARTH_DATA_API = require('../../shared/constants');

class EarthDataAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = EARTH_DATA_API;
  }

  async getHumidity() {
    return this.get(`humidity`);
  }

  async getAirTemperature() {
    return this.get(`AirTemperature`);
  }

  async getPrecipitation() {
    return this.get(`Precipitation`);
  }
}
