const DataCiteEventData = require('./dataCiteEventData')
const axios = require('../axiosService/axios')

class SourceSeed {
  static async createInstance(sourceType) {

    if (sourceType === "dataciteEventData") {
      return new DataCiteEventData(axios);
    }

    throw new Error("Invalid sourceType");  
  }
}

module.exports = SourceSeed