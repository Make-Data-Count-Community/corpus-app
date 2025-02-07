/* eslint-disable no-await-in-loop */
/* eslint-disable no-param-reassign */
const { logger } = require('@coko/server')
const eachLimit = require('async/eachLimit')
const MetadataSource = require('./metadata/metadataSource')
const AssertionFactory = require('./assertionFactory/assertionFactory')
const ActivityLog = require('../models/activityLog/activityLog')
const Source = require('../models/source/source')

const NUMBER_OF_PARALLEL_IMPORT_STREAMS = 5

class CorpusData {
  constructor(seedSource, metadataSource) {
    this.seedSource = seedSource
    this.metadataSource = metadataSource
    this.result = []
  }

  async processActivityLogsInParallel() {
    const unprocessedActivityLogs = await ActivityLog.query()
      .select('id')
      .where({ proccessed: false })

    // eslint-disable-next-line no-console
    console.log(
      `${unprocessedActivityLogs.length} unprocessed Activity Log entries`,
    )

    try {
      await eachLimit(
        unprocessedActivityLogs,
        NUMBER_OF_PARALLEL_IMPORT_STREAMS,
        this.asyncProcessActivityLog,
      )

      // eslint-disable-next-line no-console
      console.log('Activity Log entries have been processed.')
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err)
    }
  }

  /*
   * The activity log cotains data dumps from various sources, and is then processed to insert into assertions table
   */
  async asyncProcessActivityLog(activityLogRecord) {
    const sources = await Source.query()
    const metadataSource = await MetadataSource.createInstance()
    // eslint-disable-next-line no-console
    console.log(`Processing activity log ${activityLogRecord.id}...`)

    const res = await ActivityLog.query().findById(activityLogRecord.id)

    // this isn't perfect, but prevents instances that might be processing activity logs in parallel from duplicating
    if (res.proccessed) {
      logger.info(`Activity log ${activityLogRecord.id} already proccessed`)
      return 0
    }

    await ActivityLog.query()
      .patch({
        proccessed: true,
      })
      .findById(activityLogRecord.id)

    const data = JSON.parse(res.data)

    data.forEach(citation => {
      const { id } = sources.find(
        s => s.abbreviation === res.action.replace('assertion_incoming_', ''),
      )

      if (id) {
        const assertions = {
          activityId: activityLogRecord.id,
          source: id,
          event: citation,
          datacite: {},
          crossref: {},
        }

        metadataSource.startStreamCitations(assertions)
      }
    })

    metadataSource.startStreamCitations(null)

    try {
      logger.info(
        `Wait for activity log ${activityLogRecord.id} to be processed`,
      )
      const result = await metadataSource.getResult
      logger.info(
        `Saving ${result.length} assertions for activity log ${activityLogRecord.id}...`,
      )
      await AssertionFactory.saveDataToAssertionModel(result)
      return result.length
    } catch (e) {
      logger.info(e)
      throw e
    }
  }

  /**
   * At the moment is not used but can be used if you want to load all citation from memory
   *  everything from the memory
   * @returns the citations from memory that have been read from the seed source
   */

  async execute() {
    const citations = await this.seedSource.readSource()

    citations.forEach(citation => {
      const assertions = {
        event: citation,
        datacite: {},
        crossref: {},
      }

      this.metadataSource.startStreamCitations(assertions)
    })

    this.metadataSource.startStreamCitations(null)

    try {
      this.result = await this.metadataSource.getResult
      await AssertionFactory.saveDataToAssertionModel(this.result)
      return this.result
    } catch (e) {
      throw new Error(e)
    }
  }
}

module.exports = CorpusData
