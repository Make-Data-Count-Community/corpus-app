/* eslint-disable no-await-in-loop */
const { db, logger } = require('@coko/server')
const CorpusDataFactory = require('../corpusDataFactory')
const Source = require('../../models/source/source')
const Assertion = require('../../models/assertion/assertion')

/**
 * Fetch datacite records from the API
 */
const dataciteImport = async () => {
  const startDate = new Date(process.env.START_YEAR, process.env.START_YEAR_MONTH, 1)
  logger.info(`######### Start Date : ${startDate} ######### `)

  // const endDate = new Date(new Date().getFullYear(), 11, 31)
  const endDate = new Date(process.env.END_YEAR, process.env.END_YEAR_MONTH, process.env.END_YEAR_MONTH_LAST_DAY)
  endDate.setHours(23, 59, 59, 999) // set to end of the day
  logger.info(`######### End Date : ${endDate} ######### `)

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
