/* eslint-disable no-await-in-loop */
const { db, logger } = require('@coko/server')
const CorpusDataFactory = require('../corpusDataFactory')
const Source = require('../../models/source/source')
const Assertion = require('../../models/assertion/assertion')

/**
 * Fetch datacite records from the API
 */
const dataciteImport = async () => {
  const startDate = new Date(process.env.START_YEAR, 0, 1)
  logger.info(`######### Start Date : ${startDate} ######### `)

  const endDate = new Date(new Date().getFullYear(), 11, 31)

  let corpusdata = null

  // eslint-disable-next-line no-unmodified-loop-condition
  for (let d = startDate; d <= endDate; d.setMonth(d.getMonth() + 1)) {
    const year = d.getFullYear()
    const month = (d.getMonth() + 1).toString().padStart(2, '0')

    logger.info(`######### ${year} #### ${month} ######### `)

    // eslint-disable-next-line no-await-in-loop
    corpusdata = await CorpusDataFactory.dataciteCrossrefPerDate(year, month)

    // eslint-disable-next-line no-await-in-loop
    await corpusdata.seedSource.readSource()
  }

  logger.info(`######### Start Reading source : 'crossref' ######### `)
  corpusdata = await CorpusDataFactory.dataciteSourceCrossref()
  await corpusdata.seedSource.readSource()

  logger.info(`######### Start Retreving Data from API ######### `)

  await CorpusDataFactory.loadDataInParallelFromDB()

  await db.raw('REFRESH MATERIALIZED VIEW last_10_years_assertions')
  await db.raw('REFRESH MATERIALIZED VIEW count_growth_per_day')
  await db.raw('REFRESH MATERIALIZED VIEW facet_unique_counts')

  const sourceAssertions = await Assertion.query()
    .select(
      db.raw(
        'count(doi) as doicnt, count(accession_number) as doiaccessionnumer, source_id',
      ),
    )
    .groupBy('source_id')

  await Promise.all(
    sourceAssertions.map(assertion =>
      Source.query()
        .findOne({ id: assertion.sourceId })
        .patch({
          doiCount: assertion.doicnt ? parseInt(assertion.doicnt, 10) : 0,
          accessionNumberCount: assertion.doiaccessionnumer
            ? parseInt(assertion.doiaccessionnumer, 10)
            : 0,
        }),
    ),
  )
  logger.info(`######### Source counts refreshed ######### `)
}

module.exports = dataciteImport
