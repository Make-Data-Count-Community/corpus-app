const { logger } = require('@coko/server')
const fs = require('fs')
const { parse } = require('csv-parse/sync')
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

  static async createInstanceFromFile(fileContent) {
    const processedData = fileContent.map(record => ({
      doi: record['dataset_id']?.startsWith('10.')
        ? record['dataset_id'] // Handle DOIs
        : null,
      accessionNumber: !record['dataset_id']?.startsWith('10.')
        ? record['dataset_id'] // Handle accession numbers
        : null,
      title: record['dataset_id']?.startsWith('10.')
        ? null // Title can be derived from DOI metadata
        : record['title'],
      repository: record['Repository'], // Repository name
      source: 'asap', // Explicitly mark the source as "asap"
    }))

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
      const processor = new AsapFile(file) // Pass ASAP file to AsapFile
      await processor.process() // Execute the processing pipeline for ASAP
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

// Export the SeedSource class (corrected the export)
module.exports = SeedSource
