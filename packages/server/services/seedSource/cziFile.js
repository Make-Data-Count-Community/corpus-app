/* eslint-disable no-param-reassign */
/* eslint-disable no-await-in-loop */
const { logger, db, uuid } = require('@coko/server')
const JSONStream = require('JSONStream')
const es = require('event-stream')
const { model: Source } = require('../../models/source')
const { model: ActivityLog } = require('../../models/activityLog')
const DataCitePrefixData = require('./dataCitePrefixData')

// how many entries are saved per activity log record
const ACTIVITY_LOG_DATA_SIZE = 500

class CziFile {
  /*
   * @param {Object[]} files - File keys and streams.
   * @param {string} files[].fileKey - The s3 path/name of the file
   * @param {string} files[].fileStream - The readstream of the file
   */
  constructor(files) {
    this.citations = []

    this.files = files

    this.currentFileIndex = 0
    this.doiPattern = /^10\.\d{4,9}\/[-._;()/:A-Z0-9]+$/i
    logger.info(`Found ${this.files.length} files to process`)

    // TODO datacite prefixes are used to filter CZI records
    this.dataCitePrefixData = new DataCitePrefixData()
    this.dataCitePrefixData.buildPrefixSet()

    this.excludedRecords = 0
    this.numberOfDOI = 0
    this.numberOfNotDOI = 0
    this.numberExcludedDueToNotBeingDataCitePrefix = 0
    this.numberMissingDOIField = 0
  }

  readSource() {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      while (this.currentFileIndex < this.files.length) {
        this.citations.concat(await this.streamNextFile())
      }

      resolve(this.citations)
    })
  }

  async streamNextFile() {
    const citationBulk = []
    return new Promise((resolve, reject) => {
      const { fileKey, fileStream } = this.files[this.currentFileIndex]
      logger.info(`Streaming file:, ${fileKey}`)

      const JSONFileStream = fileStream.pipe(JSONStream.parse('*'))

      JSONFileStream.pipe(
        es.mapSync(async data => {
          if (this.shouldIncludeRecord(data)) {
            citationBulk.push(this.buildActivityLogRecord(data))
          } else {
            this.excludedRecords += 1
          }
        }),
      )

      fileStream.on('end', async () => {
        logger.info(`Finished streaming file:, ${fileKey}`)
        logger.info(`Citation bulk size:, ${citationBulk.length}`)
        logger.info(`Number of DOI:, ${this.numberOfDOI}`)
        logger.info(`Number of Not DOI:, ${this.numberOfNotDOI}`)
        logger.info(
          `Number of excluded due to not being datacite prefix:, ${this.numberExcludedDueToNotBeingDataCitePrefix}`,
        )
        logger.info(
          `Total number of excluded records:, ${this.excludedRecords}`,
        )
        logger.info(
          `Number of missing DOI field:, ${this.numberMissingDOIField}`,
        )
        // eslint-disable-next-line no-plusplus
        const citations = citationBulk

        while (citations.length && citations.length > 0) {
          logger.info(
            `Inserting ${ACTIVITY_LOG_DATA_SIZE} assertions at a time from ${fileKey}`,
          )
          await ActivityLog.query().insert({
            action: 'assertion_incoming_czi',
            data: JSON.stringify(citations.splice(0, ACTIVITY_LOG_DATA_SIZE)),
            tableName: 'assertions',
            countDoi: this.numberOfDOI,
            countAccessionNumber: this.numberOfNotDOI,
            fileKey,
          })
          logger.info(`${citations.length} citations left`)
        }

        // eslint-disable-next-line no-plusplus
        this.currentFileIndex++
        resolve(citations)
      })
    })
  }

  buildActivityLogRecord(result) {
    if (this.doiPattern.test(result.extracted_word)) {
      // TODO verify if this is the right field to test
      // eslint-disable-next-line no-plusplus
      this.numberOfDOI++
      return {
        id: uuid(),
        dataCiteDoi: result.extracted_word,
        crossrefDoi: result.doi,
        ...result,
      }
    }

    // eslint-disable-next-line no-plusplus
    this.numberOfNotDOI++
    return {
      id: uuid(),
      accessionNumber: result.extracted_word,
      crossrefDoi: result.doi,
      ...result,
    }
  }

  /**
   * CZI data provided is noisy and some records should be excluded based on discussions had
   * in this issue https://gitlab.coko.foundation/datacite/datacite/-/issues/25
   */
  shouldIncludeRecord(data) {
    if (!data.doi) {
      logger.info(`Record excluded missing DOI field:, ${data.paper_pmcid}`)
      // eslint-disable-next-line no-plusplus
      this.numberMissingDOIField++
      return false
    }

    if (
      data.label &&
      (data.label.includes('B-DAT-nct') || data.label.includes('B-DAT-eudract'))
    ) {
      return false
    }

    // if prefix derived from extracted_word is not in the list of datacite prefixes, then exclude
    if (this.doiPattern.test(data.extracted_word)) {
      const doiPrefix = data.extracted_word.split('/')[0]

      if (!this.dataCitePrefixData.prefixSet.has(doiPrefix)) {
        // eslint-disable-next-line no-plusplus
        this.numberExcludedDueToNotBeingDataCitePrefix++
        return false
      }
    }

    return true
  }

  // eslint-disable-next-line class-methods-use-this
  // this is not used anymore since the dataset got too large to run this reasonably
  async filterOutExistingCitations(data) {
    let result = []
    await db.transaction(async trx => {
      const { id } = await Source.query(trx).findOne({
        abbreviation: 'czi',
      })

      await db
        .raw(
          `CREATE TEMPORARY TABLE temp_assertions (
          id uuid,
          source_id uuid,
          obj_id text not null,
          subj_id text not null
          ) ON COMMIT DROP;
        `,
        )
        .transacting(trx)

      await db('temp_assertions')
        .insert(
          data.map(d => ({
            id: d.id,
            source_id: id,
            obj_id: d.paper_doi || d.doi,
            subj_id: d.dataset || d.extracted_word,
          })),
        )
        .transacting(trx)

      const notProcessed = await db
        .raw(
          'select b.id from temp_assertions b left join assertions a on b.obj_id = a.obj_id and b.subj_id = a.subj_id where a.id is null',
        )
        .transacting(trx)

      result = result.concat(notProcessed.rows.map(np => np.id))
    })

    return data.filter(d => result.includes(d.id))
  }
}

module.exports = CziFile
