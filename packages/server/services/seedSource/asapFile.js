/* eslint-disable no-param-reassign */
/* eslint-disable no-await-in-loop */
const { logger, db, uuid } = require('@coko/server')
const JSONStream = require('JSONStream')
const es = require('event-stream')
const { model: ActivityLog } = require('../../models/activityLog')

// Define constants
const ACTIVITY_LOG_DATA_SIZE = 500 // Batch size for inserting logs
const DOI_PATTERN = /^10\.\d{4,9}\/[-._;()/:A-Z0-9]+$/i

class AsapFile {
  constructor(file) {
    this.citations = [] // Store all citations for this file
    this.file = file

    // Tracking statistics
    this.excludedRecords = 0
    this.numberOfDOI = 0
    this.numberOfNotDOI = 0

    logger.info(`Initialized AsapFile with file: ${file.fileKey}`)
  }

  async process() {
    return new Promise(async (resolve, reject) => {
      try {
        const source = await this.getSource()
        const citationBulk = await this.streamFile()
        await this.insertActivityLog(citationBulk, source)
        resolve(citationBulk)
      } catch (error) {
        logger.error(`Error processing ASAP file: ${error.message}`)
        reject(error)
      }
    })
  }

  async getSource() {
    const source = await Source.query().findOne({ abbreviation: 'asap' })
    if (!source) {
      throw new Error('Source "asap" not found in the database. Please add it to the Source table.')
    }
    logger.info(`Retrieved "asap" source from DB: ${JSON.stringify(source)}`)
    return source
  }

  async streamFile() {
    const citationBulk = []
    const { fileKey, fileStream } = this.file

    return new Promise((resolve, reject) => {
      const JSONFileStream = fileStream.pipe(JSONStream.parse('*'))

      JSONFileStream.pipe(
        es.mapSync(data => {
          const record = this.buildCitationRecord(data)
          if (record) citationBulk.push(record)
          else this.excludedRecords += 1
        }),
      )
      .on('end', () => resolve(citationBulk))
      .on('error', err => reject(err))
    })
  }

  buildCitationRecord(row) {
    const isDoi = DOI_PATTERN.test(row.dataset_id)
    if (isDoi) this.numberOfDOI++
    else this.numberOfNotDOI++

    return {
      id: uuid(),
      articleDoi: isDoi ? `https://doi.org/${row.dataset_id}` : null,
      accessionNumber: !isDoi ? row.dataset_id : null,
      repository: row.repository,
      source: 'asap',
    }
  }

  async insertActivityLog(citations, source) {
    const { fileKey } = this.file
    await ActivityLog.query().insert({
      action: 'assertion_incoming_asap',
      data: JSON.stringify(citations),
      tableName: 'assertions',
      countDoi: this.numberOfDOI,
      countAccessionNumber: this.numberOfNotDOI,
      source_id: source.id,
      fileKey,
    })
  }
}

module.exports = AsapFile
