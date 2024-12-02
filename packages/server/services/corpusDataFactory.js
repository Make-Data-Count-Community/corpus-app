/* eslint-disable no-param-reassign */
const SeedSource = require('./seedSource/seedSource')
const MetadataSource = require('./metadata/metadataSource')
const CorpusData = require('./corpusData')
const fs = require('fs')
const { parse } = require('csv-parse/sync')

class CorpusDataFactory {
  static async dataciteSourceCrossref() {
    const seedSource = await SeedSource.createInstanceDatacite([
      'source-id=crossref',
      'relation-type-id=references,cites,is-supplemented-by',
    ])

    const metadataSource = await MetadataSource.createInstance()

    const corpusData = new CorpusData(seedSource, metadataSource)
    return corpusData
  }

  static async dataciteCrossrefPerDate(year, month) {
    const seedSource = await SeedSource.createInstanceDatacite([
      'source-id=datacite-crossref',
      `relation-type-id=is-referenced-by,is-cited-by,is-supplement-to&year-month=${year}-${month}`,
    ])

    const metadataSource = await MetadataSource.createInstance()

    const corpusData = new CorpusData(seedSource, metadataSource)
    return corpusData
  }

  static async cziFile() {
    const seedSource = await SeedSource.createInstanceCzi()

    const metadataSource = await MetadataSource.createInstance()

    const corpusData = new CorpusData(seedSource, metadataSource)
    return corpusData
  }

  static async asapFile() {
    // Read the file path from environment
    const asapFilePath = process.env.ASAP_LOCAL_FILE_PATH

    // Ensure the file exists
    if (!fs.existsSync(asapFilePath)) {
      throw new Error(`ASAP file not found at path: ${asapFilePath}`)
    }

    // Create the seed and metadata sources
    const seedSource = await SeedSource.createInstanceFromFile(asapFilePath)
    const metadataSource = await MetadataSource.createInstance()

    // Return new CorpusData instance with ASAP data
    return new CorpusData(seedSource, metadataSource)
  }

  static async loadDataInParallelFromDB() {
    const corpusData = new CorpusData(null, null)

    await corpusData.processActivityLogsInParallel()
  }
}

module.exports = CorpusDataFactory
