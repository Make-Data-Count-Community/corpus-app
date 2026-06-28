const { db, logger } = require('@coko/server')
const Assertion = require('../../models/assertion/assertion')
const CorpusDataFactory = require('../corpusDataFactory')
const SeedSource = require('../seedSource/seedSource')
const Source = require('../../models/source/source')


const epmcImport = async () => {
  try {
    logger.info('######### Start Reading EPMC files from S3 #########')

    await SeedSource.createInstanceReadS3Eupmc()

    logger.info(`######### Start Retreving Data from API ######### `)

    await CorpusDataFactory.loadDataInParallelFromDB()

    logger.info(`######### Start Refreshing materialized views ######### `)

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

    logger.info(`######### Source counts refreshed #########`)
  } catch (e) {
    logger.error(`EUPMC import failed: ${e.message}`)
    throw new Error(e)
  }
}

module.exports = epmcImport
