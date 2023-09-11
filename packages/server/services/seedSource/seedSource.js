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
        'czi/dataset_mentions_test/', //TODO change this folder Unzipped subfolder of CZI json files
      )

      const czi = new CziFile(fileStreams, true) //TODO this boolean switches to parsing the new dataset format

      return await czi.readSource() //TODO testing first by reading a single file
    } catch (e) {
      logger.error(e)
    }

    return false
  }
}

module.exports = SeedSource
