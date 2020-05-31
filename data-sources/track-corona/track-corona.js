const { RESTDataSource } = require('apollo-datasource-rest');
const { TRACK_CORONA_API } = require('../../shared/constants');

/**
 * rona api
 */
class TrackCoronaAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = TRACK_CORONA_API;
  }

  async getCountries() {
    return this.get(`countries`);
  }

  async getProvinces() {
    return this.get(`provinces`);
  }

  async getCities() {
    return this.get(`cities`);
  }

  async getCountryLevelData(code) {
    return this.get(`countries/${code}`);
  }

  async getProvinceLevelData(name) {
    return this.get(`provinces/${name}`)
  }

  async getCityLevelData(name) {
    return this.get(`city/${name}`);
  }

  async getTravelData() {
    return this.get(`travel`);
  }
}

exports.TrackCoronaAPI = TrackCoronaAPI;
