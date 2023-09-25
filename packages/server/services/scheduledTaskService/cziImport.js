/* eslint-disable no-await-in-loop */
const { db, logger } = require('@coko/server')
const seedSource = require('../seedSource/seedSource')
const CorpusDataFactory = require('../corpusDataFactory')
const { model: ActivityLog } = require('../../models/activityLog')
const Source = require('../../models/source/source')
const Assertion = require('../../models/assertion/assertion')

/**
 * Fetch all CZI records from S3 and save them to the DB
 */
const cziImport = async () => {
  // logger.info(`######### Start Reading CZI files from S3 ######### `)

  // await seedSource.createInstanceReadS3Czi()

  // logger.info(`######### CZI files read from S3  ######### `)
  logger.info(`######### Start Retreving Data from API ######### `)

  async function myAsyncFunction() {
    await CorpusDataFactory.loadDataInParallelFromDB()

    // const countAssertions = await ActivityLog.query()
    //   .count({ count: '*' })
    //   .andWhere(builder => {
    //     builder.where('proccessed', '=', false)
    //     builder.andWhere('done', '=', false)
    //   })

    // if (countAssertions[0].count !== '0') {
    //   setImmediate(myAsyncFunction)
    // }
  }

  await myAsyncFunction()

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
