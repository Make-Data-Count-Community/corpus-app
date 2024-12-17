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
        await this.insertActivityLogs(citationBulk, source) // Update method call
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
    const { records } = this.file // Use the parsed records array
  
    logger.info(`Processing ${records.length} rows`)
  
    // Loop through each record
    for (const row of records) {
      const record = this.buildCitationRecord(row) // Transform the record
      if (record) citationBulk.push(record)
      else this.excludedRecords += 1 // Track excluded records
    }
  
    return citationBulk // Return the processed bulk data
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

  async insertActivityLogs(citations, source) {
    const { fileKey } = this.file

    // Insert one activity log per citation
    for (const citation of citations) {
      await ActivityLog.query().insert({
        action: 'assertion_incoming_asap',
        data: JSON.stringify(citation), // Insert single citation
        type: 'assertions',
        countDoi: citation.articleDoi ? 1 : 0, // 1 if DOI exists, else 0
        countAccessionNumber: citation.accessionNumber ? 1 : 0, // 1 if Accession Number exists, else 0
        source_id: source.id,
        fileKey,
      })
    }

    logger.info(`Inserted ${citations.length} activity log entries for file: ${fileKey}`)
  }
}

module.exports = AsapFile
