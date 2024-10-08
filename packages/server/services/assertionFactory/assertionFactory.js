const { chunk } = require('lodash')

const { useTransaction, logger } = require('@coko/server')
const Source = require('../../models/source/source')
const { model: Subject } = require('../../models/subject')
const Assertion = require('../../models/assertion/assertion')
const ActivityLog = require('../../models/activityLog/activityLog')

const DataciteToAssertion = require('./dataciteToAssertion')
const DataciteEventToAssertion = require('./dataciteEventToAssertion')
const CrossrefToAssertion = require('./crossrefToAssertion')
const CziToAssertion = require('./cziToAssertion')

class AssertionFactory {
  static SOURCE_MAP_CLASS = {
    datacite: [
      DataciteToAssertion,
      DataciteEventToAssertion,
      CrossrefToAssertion,
    ],
    czi: [DataciteToAssertion, CrossrefToAssertion, CziToAssertion],
  }

  static async saveDataToAssertionModel(data) {
    const assertions = []
    return useTransaction(async trx => {
      const subjects = await Subject.query(trx)
      const sources = await Source.query(trx)
      let activityId = null

      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < data.length; i++) {
        const assertion = {}
        const chunks = data[i]
        activityId = chunks.activityId

        const source = sources.find(s => s.id === chunks.source)
        const classes = AssertionFactory.SOURCE_MAP_CLASS[source.abbreviation]
        // eslint-disable-next-line no-await-in-loop
        await Promise.all(
          classes.map(Cls => {
            const saveClass = new Cls(subjects)
            return saveClass.transformToAssertion(assertion, chunks, trx)
          }),
        )

        assertion.activityId = chunks.activityId
        assertions.push(assertion)
      }

      const assertionsArray = chunk(assertions, 5000)

      logger.info(
        `Inserting assertions from activity log  ${activityId} into DB`,
      )
      await Promise.all(
        assertionsArray.map(assert => Assertion.query(trx).insert(assert)),
      )

      logger.info(`Updating activity log ${activityId} to done`)

      const patch = await ActivityLog.query(trx)
        .findById(activityId)
        .patch({ done: true }) // TODO do we want to import entries that have proccessed=true but done=false

      logger.info(
        `All assertions from activity log ${activityId} inserted into DB`,
      )
      return patch
    })
  }
}

module.exports = AssertionFactory
