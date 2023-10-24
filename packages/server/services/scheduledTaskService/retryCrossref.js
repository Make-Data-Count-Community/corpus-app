/* eslint-disable no-await-in-loop */
const { logger } = require('@coko/server')
const MetadataSource = require('../metadata/metadataSource')
const Assertion = require('../../models/assertion/assertion')
const AssertionFactory = require('../assertionFactory/assertionFactory')

/**
 * Many assertions failed to retrieve metadata from crossref API during the CZI import
 * This script finds all assertions with missing metadata and tries to retrieve it again
 */
const retryCrossref = async () => {
  logger.info(
    `######### Finding assertions with missing publisher_id, published_date, journal_id ######### `,
  )

  let assertions = []

  do {
    assertions = await Assertion.query()
      .whereNull('published_date')
      .whereNull('published_date')
      .whereNull('journal_id')
      .whereNotNull('accession_number')
      .whereNull('not_found')
      .where({ retried: false })
      .limit(100)

    const metadataSource = await MetadataSource.createCrossrefRetryStream()
    metadataSource.startStreamCitations(assertions)
    metadataSource.startStreamCitations(null)
    const result = await metadataSource.getResult

    await AssertionFactory.updateAssertionsWithNewCrossrefData(result)
  } while (assertions.length > 0)

  logger.info(`######### Finished ######### `)
}

module.exports = retryCrossref
