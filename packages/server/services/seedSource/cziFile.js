/* eslint-disable no-param-reassign */
/* eslint-disable no-await-in-loop */
const { logger, db, uuid } = require('@coko/server')
const fs = require('fs')
const JSONStream = require('JSONStream')
const es = require('event-stream')
const { model: Source } = require('../../models/source')
const { model: ActivityLog } = require('../../models/activityLog')
const DataCitePrefixData = require('../seedSource/dataCitePrefixData')

const files = require('../../storage/czi')

class CziFile {
  constructor(fileStreams = null, v2FileFormat = false) {
    this.citations = []
    this.v2FileFormat = v2FileFormat //flag to change the import logic to match the new dataset file format

    this.fileNames =
      fileStreams ||
      files.map(fileName =>
        // eslint-disable-next-line node/no-path-concat
        fs.createReadStream(`${__dirname}/../../storage/czi/${fileName}`),
      )

    this.currentFileIndex = 0
    this.doiPattern = /^10\.\d{4,9}\/[-._;()/:A-Z0-9]+$/i
    logger.info(`Found ${this.fileNames.length} files to process`)

    //TODO datacite prefixes are used to filter CZI records
    this.dataCitePrefixData = new DataCitePrefixData()
    this.dataCitePrefixData.buildPrefixSet()

    this.numberOfDOI = 0;
    this.numberOfNotDOI = 0;
    this.numberExcludedDueToNotBeingDataCitePrefix = 0;
    this.numberMissingDOIField = 0;
  }

  readSource() {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      while (this.currentFileIndex < this.fileNames.length) {
        this.citations.concat(await this.streamNextFile())
      }

      resolve(this.citations)
    })
  }

  async streamNextFile() {
    const citationBulk = []
    return new Promise((resolve, reject) => {
      const fileName = this.fileNames[this.currentFileIndex]
      logger.info(`Streaming file:, ${fileName}`)

      const fileStream = this.fileNames[this.currentFileIndex].pipe(
        JSONStream.parse('*'),
      )

      fileStream.pipe(
        es.mapSync(async data => {
          logger.info(`Processing record:, ${data.paper_pmcid}`)    
          if(this.v2FileFormat && this.shouldIncludeRecord(data)) {
            citationBulk.push(this.v2DataAssertion(data))
          }
          //  else {
          //   citationBulk.push(this.v1DataAssertion(data))
          // }    
        }),
      )

      fileStream.on('end', async () => {
        logger.info(`Finished streaming file:, ${fileName}`)
        logger.info(`Citation bulk size before filter query:, ${citationBulk.length}`)
        logger.info(`Number of DOI:, ${this.numberOfDOI}`)
        logger.info(`Number of Not DOI:, ${this.numberOfNotDOI}`)
        logger.info(`Number of excluded due to not being datacite prefix:, ${this.numberExcludedDueToNotBeingDataCitePrefix}`)
        logger.info(`Number of missing DOI field:, ${this.numberMissingDOIField}`)
        // eslint-disable-next-line no-plusplus
        //const citations = await this.filterOutExistingCitations(citationBulk)
        const citations = citationBulk // citationBulk.slice(0, 10) //TODO fix filter query?
        //logger.info(`Citation bulk size after filter query:, ${citations.length}`)

        while(citations.length && citations.length > 0) {
          logger.info("Inserting 1000 assertions at a time")
          await ActivityLog.query().insert({
            action: 'assertion_incoming_czi',
            data: JSON.stringify(citations.splice(0, 1000)),
            tableName: 'assertions',
          })
          logger.info(`${citations.length} citations left`)
        }
        
        // // eslint-disable-next-line no-plusplus
        this.currentFileIndex++
        resolve(citations) 
      })
    })
  }

  // eslint-disable-next-line class-methods-use-this
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

  async v1DataAssertion(result) {
    if (this.doiPattern.test(result.dataset)) {
      return {
        id: uuid(),
        dataCiteDoi: result.dataset,
        crossrefDoi: result.paper_doi,
        ...result,
      }
    } else {
      return {
        id: uuid(),
        accessionNumber: result.dataset,
        crossrefDoi: result.paper_doi,
        ...result,
      }
    }
  }

  v2DataAssertion(result) {
    if (this.doiPattern.test(result.extracted_word)) { //TODO verify if this is the right field to test
      logger.info("Is DOI")
      this.numberOfDOI++;
      return {
        id: uuid(),
        dataCiteDoi: result.extracted_word,
        crossrefDoi: result.doi,
        ...result,
      }
    } else {
      logger.info(`${result.extracted_word} Is not DOI`)
      this.numberOfNotDOI++;
      return {
        id: uuid(),
        accessionNumber: result.extracted_word,
        crossrefDoi: result.doi,
        ...result,
      }
    }

  }

  /**
   * CZI data provided is noisy and some records should be excluded based on discussions had
   * in this issue https://gitlab.coko.foundation/datacite/datacite/-/issues/25
   */
  async shouldIncludeRecord(data) {
    if(!data.doi) {
      logger.info(`Record excluded missing DOI field:, ${data.paper_pmcid}`)
      this.numberMissingDOIField++;
      return false
    
    }
    if(data.label && (data.label.includes('B-DAT-nct') || data.label.includes('B-DAT-eudract'))) {
      logger.info(`Excluding record due to label:, ${data.extracted_word}`)
      return false
    }
    //if prefix is not in the list of datacite prefixes, then exclude
    if(this.doiPattern.test(data.extracted_word)) {
      logger.info(`Checking prefix:, ${data.extracted_word}`)
      const doiPrefix = data.extracted_word.split('/')[0]
      if(!this.dataCitePrefixData.prefixSet.has(doiPrefix)) {
        logger.info(`Record excluded based on prefix:, ${doiPrefix}`)
        this.numberExcludedDueToNotBeingDataCitePrefix++;
        return false
      }
    }
    
    return true
  }
}

module.exports = CziFile
