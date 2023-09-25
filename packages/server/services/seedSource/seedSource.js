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

      const files = await awsService.readS3Folder(
        'seed-source-files',
        process.env.S3_CZI_FOLDER_PATH, // TODO change this folder Unzipped subfolder of CZI json files
      )

      files.forEach(file => {
        // eslint-disable-next-line no-console
        console.dir(file.fileKey) // TODO exclude files that have a key already in the activity log table
      })

      const czi = new CziFile(files)

      return await czi.readSource()
    } catch (e) {
      logger.error(e)
    }

    return false
  }
}

module.exports = SeedSource
