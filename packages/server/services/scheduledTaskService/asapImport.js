const { db, logger } = require('@coko/server')
const fs = require('fs')
const { parse } = require('csv-parse/sync')
const SeedSource = require('../seedSource/seedSource')
const MetadataSource = require('../metadata/metadataSource')
const AssertionFactory = require('../assertionFactory/assertionFactory')
const Assertion = require('../../models/assertion/assertion')
const Source = require('../../models/source/source')

const asapFilePath = process.env.ASAP_LOCAL_FILE_PATH

const asapImport = async () => {
  try {
    logger.info('######### Start Reading ASAP files from local #########')

    if (!asapFilePath) {
      throw new Error('ASAP_LOCAL_FILE_PATH environment variable is not set.')
    }

    if (!fs.existsSync(asapFilePath)) {
      throw new Error(`ASAP file not found at path: ${asapFilePath}`)
    }

    const rawContent = fs.readFileSync(asapFilePath, 'utf8')

    const fileContent = parse(rawContent, { 
      columns: true, 
      skip_empty_lines: true,
    })

    const seedSource = await SeedSource.createInstanceFromFile(fileContent)
    const metadataSource = await MetadataSource.createInstance()

    for (const record of seedSource.data) {
      metadataSource.startStreamCitations(record)
    }

    metadataSource.startStreamCitations(null)
    const result = await metadataSource.getResult
    logger.info(`Saving ${result.length} assertions for ASAP file...`)
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
    logger.info(`######### Source counts refreshed ######### `)
  } catch (e) {
    throw new Error(e)
  }
}

module.exports = asapImport
