const { logger } = require('@coko/server')
const DataCiteEventData = require('./dataCiteEventData')
const axios = require('../axiosService')
const CziFile = require('./cziFile')
const AwsS3Service = require('../awsS3Service')

class SeedSource {
  static async createInstanceDatacite(filter) {
    return new DataCiteEventData(axios, filter)
  }

  static async createInstanceCzi() {
    return new CziFile()
  }

  static async createInstanceReadS3Czi() {
    try {
      const awsService = new AwsS3Service()

      const fileStreams = await awsService.readS3Folder(
        'seed-source-files',
        'czi/',
      )

      const czi = new CziFile(fileStreams)

      return await czi.readSource()
    } catch (e) {
      logger.error(e)
    }

    return false
  }
}

module.exports = SeedSource
