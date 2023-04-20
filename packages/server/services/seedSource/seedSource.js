const DataCiteEventData = require('./dataCiteEventData')
const axios = require('../axiosService')

class SeedSource {
  static createInstance(seedType) {

    if (seedType === "dataciteEventData") {
      return  new DataCiteEventData(axios)
    }

    throw new Error("Invalid sourceType");  
  }
}

module.exports = SeedSource