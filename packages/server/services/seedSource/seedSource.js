const { logger, uuid } = require('@coko/server')
const DataCiteEventData = require('./dataCiteEventData')
const axios = require('../axiosService')
const CziFile = require('./cziFile')
const AsapFile = require('./asapFile')
const AwsS3Service = require('../awsS3Service')
const { model: ActivityLog } = require('../../models/activityLog')
const { model: Source } = require('../../models/source')
const fs = require('fs')
const path = require('path')
const { parse } = require('csv-parse/sync') // Use csv-parse for parsing CSV files

class SeedSource {
  static async createInstanceDatacite(filter) {
    return new DataCiteEventData(axios, filter)
  }

  static async createInstanceCzi() {
    return new CziFile()
  }

  static async createInstanceEupmcFromLocalFolder(folderPath) {
    const processedData = []
    const source = await Source.query().findOne({ abbreviation: 'eupmc' })
    if (!source) {
      throw new Error('Source "eupmc" not found in the database. Please add it to the Source table.')
    }
    logger.info(`Retrieved "eupmc" from DB: ${JSON.stringify(source)}`)

    const files = fs.readdirSync(folderPath).filter(file => file.endsWith('.csv'))
    for (const file of files) {
      const filePath = path.join(folderPath, file)
      const rawContent = fs.readFileSync(filePath, 'utf8')
      const fileContent = parse(rawContent, { columns: true, skip_empty_lines: true })

      const citations = fileContent.map(record => {
        const datasetId = record['dataset']?.trim()
        const publicationDoi = record['publication']?.trim()
        const repository = record['repository']?.trim()

        if (!datasetId || !publicationDoi) {
          logger.warn(`Skipping row due to missing required fields: ${JSON.stringify(record)}`)
          return null
        }

        const isDatasetDoi = datasetId.startsWith('10.')
        const isPublicationDoi = publicationDoi.startsWith('10.')
        const doiBaseUrl = 'https://doi.org/'

        return {
          id: uuid(),
          doi: isDatasetDoi ? datasetId : null,
          accessionNumber: !isDatasetDoi ? datasetId : null,
          source: source.id,
          dataset: isDatasetDoi ? `${doiBaseUrl}${datasetId}` : datasetId,
          subjId: isDatasetDoi ? `${doiBaseUrl}${datasetId}` : datasetId,
          objId: isPublicationDoi ? `${doiBaseUrl}${publicationDoi}` : publicationDoi,
          publication: isPublicationDoi ? `${doiBaseUrl}${publicationDoi}` : publicationDoi,
          repository,
          datacite: {},
          crossref: {},
          event: {
            dataCiteDoi: isDatasetDoi ? datasetId : null,
            crossrefDoi: isPublicationDoi ? publicationDoi : null,
          },
        }
      }).filter(Boolean)

      const activityLogEntry = await ActivityLog.query()
        .insert({
          action: 'assertion_incoming_eupmc',
          data: JSON.stringify(citations),
          tableName: 'assertions',
          type: 'activityLog',
          fileKey: `seed-source-processing-eupmc-${file}`,
        })
        .returning('id')

      for (const citation of citations) {
        citation.activityId = activityLogEntry.id
        processedData.push(citation)
      }
    }

    const seedSource = new SeedSource()
    seedSource.data = processedData
    return seedSource
  }


  static async createInstanceFromFile(fileContent) {
    const processedData = [];
  
    // Retrieve the source from the database
    const source = await Source.query().findOne({ abbreviation: 'asap' });
    if (!source) {
      throw new Error('Source "asap" not found in the database. Please add it to the Source table.');
    }
    logger.info(`Retrieved "asap" from DB: ${JSON.stringify(source)}`);
  
    // Create citations array
    const citations = fileContent.map(record => {
      const isDoi = record['dataset_id']?.startsWith('10.');
      const isCrossrefDoi = record['article_id']?.startsWith('10.');
      const doiBaseUrl = 'https://doi.org/';

      return {
        id: uuid(),
        doi: isDoi ? record['dataset_id'] : null,
        accessionNumber: !isDoi ? record['dataset_id'] : null,
        source: source.id,
        dataset: isDoi ? `${doiBaseUrl}${record['dataset_id']}` : record['dataset_id'],
        subjId: isDoi ? `${doiBaseUrl}${record['dataset_id']}` : record['dataset_id'],
        objId: isCrossrefDoi ? `${doiBaseUrl}${record['article_id']}` : record['article_id'],
        publication: isCrossrefDoi ? `${doiBaseUrl}${record['article_id']}` : record['article_id'],
        datacite: {},
        crossref: {},
        event: {
          dataCiteDoi: isDoi ? record['dataset_id'] : null,
          crossrefDoi: isCrossrefDoi ? record['article_id'] : null,
        },
      };
    });
  
    // Create a single ActivityLog entry with all citations as JSON
    const activityLogEntry = await ActivityLog.query()
      .insert({
        action: 'assertion_incoming_asap',
        data: JSON.stringify(citations),
        tableName: 'assertions',
        type: 'activityLog',
        fileKey: 'seed-source-processing-asap',
      })
      .returning('id');
  
    // Assign the activity log ID to each citation
    for (const citation of citations) {
      citation.activityId = activityLogEntry.id;
      processedData.push(citation);
    }
  
    const seedSource = new SeedSource();
    seedSource.data = processedData;
    return seedSource;
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
