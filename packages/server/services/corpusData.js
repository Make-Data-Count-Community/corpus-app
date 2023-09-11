/* eslint-disable no-await-in-loop */
/* eslint-disable no-param-reassign */
const { useTransaction } = require('@coko/server')
const { model: Assertion } = require('../models/assertion')
const AssertionFactory = require('./assertionFactory/assertionFactory')
const ActivityLog = require('../models/activityLog/activityLog')
const Source = require('../models/source/source')

class CorpusData {
  constructor(seedSource, metadataSource) {
    this.seedSource = seedSource
    this.metadataSource = metadataSource
    this.result = []
  }

  async transformToAssertionAndSave() {
    const assertions = []
    // console.log(JSON.stringify(this.result))

    useTransaction(async trx => {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < this.result.length; i++) {
        const assertion = {}
        const chunk = this.result[i]

        await this.seedSource.transformToAssertion(assertion, chunk, trx)

        await Promise.all(
          this.metadataSource.streamApis.map(api =>
            api.transformToAssertion(assertion, chunk, trx),
          ),
        )
        assertions.push(assertion)
      }

      await Assertion.query(trx).insert(assertions)
    })
  }

  /**
   * Load citations that have been saved to the db
   * @param {*} selected object with start and end pointers of the citations you want to load
   *
   */
  async loadCitationsFromDB(selected = null) {
    // eslint-disable-next-line no-console
    const sources = await Source.query()

    const citationDataQuery = ActivityLog.query()
      .select('id')
      .where({ proccessed: false })

    if (selected) {
      console.log(`Selecting data from ${selected.start} to ${selected.end}...`)
      citationDataQuery.andWhere(builder => {
        builder.whereBetween('cursorId', [selected.start, selected.end])
      })
    }

    const citationData = await citationDataQuery

    const item = citationData[Math.floor(Math.random() * citationData.length)]

    if (item) {
      const res = await ActivityLog.query().patchAndFetchById(item.id, {
        proccessed: true,
      })

      const data = JSON.parse(res.data)
      // eslint-disable-next-line no-console
      data.forEach(citation => {
        const { id } = sources.find(
          s => s.abbreviation === res.action.replace('assertion_incoming_', ''),
        )

        if (id) {
          const assertions = {
            activityId: item.id,
            source: id,
            event: citation,
            datacite: {},
            crossref: {},
          }
          this.metadataSource.startStreamCitations(assertions)
        }
      })

      this.metadataSource.startStreamCitations(null)

      try {
        const result = await this.metadataSource.getResult
        await AssertionFactory.saveDataToAssertionModel(result)
      } catch (e) {
        throw new Error(e)
      }
    }
  }

  /**
   * At the moment is not used but can be used if you want to load all citation from memory
   *  everything from the memory
   * @returns the citations from memory that have been read from the seed source
   */

  async execute() {
    const citations = await this.seedSource.readSource()

    citations.forEach((citation, index) => {
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
