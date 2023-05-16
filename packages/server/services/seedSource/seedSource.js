const DataCiteEventData = require('./dataCiteEventData')
const axios = require('../axiosService')

class SeedSource {
  static createInstanceDatacite(filter) {
    return new DataCiteEventData(axios, filter)
  }
}

module.exports = SeedSource
