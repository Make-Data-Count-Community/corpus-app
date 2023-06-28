const DataCiteEventData = require('./dataCiteEventData')
const axios = require('../axiosService')
const CziFile = require('./cziFile')

class SeedSource {
  static async createInstanceDatacite(filter) {
    return new DataCiteEventData(axios, filter)
  }

  static async createInstanceCzi() {
    return new CziFile()
  }
}

module.exports = SeedSource
