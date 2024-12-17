const { logger } = require('@coko/server')
const DataCiteEventData = require('./dataCiteEventData')
const axios = require('../axiosService')
const CziFile = require('./cziFile')
const AwsS3Service = require('../awsS3Service')
const { model: ActivityLog } = require('../../models/activityLog')
const { model: Source } = require('../../models/source') // Import Source model

class SeedSource {
  static async createInstanceDatacite(filter) {
    return new DataCiteEventData(axios, filter)
  }

  static async createInstanceCzi() {
    return new CziFile()
  }

  static async createInstanceFromFile(fileContent) {
    const processedData = []

    const source = await Source.query().findOne({ abbreviation: 'asap' })
    if (!source) {
      throw new Error('Source "asap" not found in the database. Please add it to the Source table.')
    }
    logger.info(`Retrieved "asap" from DB: ${JSON.stringify(source)}`)

    for (const record of fileContent) {
      const isDoi = record['dataset_id']?.startsWith('10.')

      const citationRecord = {
        doi: record['dataset_id']?.startsWith('10.')
          ? record['dataset_id']
          : null,
        accessionNumber: !record['dataset_id']?.startsWith('10.')
          ? record['dataset_id']
          : null,
        source: source.id,
        datacite: {},
        crossref: {},
        event: {
          dataCiteDoi: record['dataset_id']?.startsWith('10.')
          ? record['dataset_id']
          : null
        }
      }

      const activityLogEntry = await ActivityLog.query()
        .insert({
          action: 'assertion_incoming_asap',
          data: JSON.stringify(citationRecord),
          tableName: 'assertions',
          type: 'activityLog',
          fileKey: 'seed-source-processing-asap'
        })
        .returning('id')

      citationRecord.activityLogId = activityLogEntry.id

      processedData.push(citationRecord)
    }

    const seedSource = new SeedSource()
    seedSource.data = processedData
    return seedSource
  }

  /**
   * Process a single ASAP file, typically in JSON format, by streaming its content.
   * New method added for processing ASAP-specific files using `AsapFile`.
   * @param {Object} file - Contains `fileKey` and `fileStream` for ASAP processing.
   * @returns {Promise<AsapFile>}
   */
  static async createInstanceAsap(file) {
    try {
      logger.info('##### Starting ASAP File Processing #####')
      const processor = new AsapFile(file)
      await processor.process()
      logger.info('##### ASAP File Processing Completed Successfully #####')
      return processor
    } catch (error) {
      logger.error('Error in createInstanceAsap:', error.message)
      throw error
    }
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
