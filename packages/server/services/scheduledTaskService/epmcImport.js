const { db, logger } = require('@coko/server')
const fs = require('fs')
const SeedSource = require('../seedSource/seedSource')
const MetadataSource = require('../metadata/metadataSource')
const AssertionFactory = require('../assertionFactory/assertionFactory')
const Assertion = require('../../models/assertion/assertion')
const Source = require('../../models/source/source')

const epmcFolderPath = process.env.EPMC_LOCAL_FILE_PATH

const epmcImport = async () => {
  try {
    logger.info('######### Start Reading EPMC files from local folder #########')

    if (!epmcFolderPath) {
      throw new Error('EPMC_LOCAL_FOLDER_PATH environment variable is not set.')
    }

    if (!fs.existsSync(epmcFolderPath)) {
      throw new Error(`EUPMC folder not found at path: ${epmcFolderPath}`)
    }

    const seedSource = await SeedSource.createInstanceEupmcFromLocalFolder()
    const metadataSource = await MetadataSource.createInstance()

    for (const record of seedSource.data) {
      metadataSource.startStreamCitations(record)
    }

    metadataSource.startStreamCitations(null)
    const result = await metadataSource.getResult
    logger.info(`Saving ${result.length} assertions for EUPMC folder...`)
    await AssertionFactory.saveDataToAssertionModel(result)

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
