/* eslint-disable no-await-in-loop */
const { db, logger } = require('@coko/server')
const CorpusDataFactory = require('../corpusDataFactory')
const Source = require('../../models/source/source')
const Assertion = require('../../models/assertion/assertion')

/**
 * Fetch all CZI records from S3 and save them to the DB
 * Files will be read from the path specified in S3_CZI_FOLDER_PATH env var
 */
const cziImport = async () => {
  // logger.info(`######### Start Reading CZI files from S3 ######### `)

  // await seedSource.createInstanceReadS3Czi()

  // logger.info(`######### CZI files read from S3  ######### `)
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

module.exports = cziImport
