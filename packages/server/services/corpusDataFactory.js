/* eslint-disable no-param-reassign */
const SeedSource = require('./seedSource/seedSource')
const MetadataSource = require('./metadata/metadataSource')
const CorpusData = require('./corpusData')

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

  static async loadDataInParallelFromDB() {
    const corpusData = new CorpusData(null, null)

    await corpusData.processActivityLogsInParallel()
  }
}

module.exports = CorpusDataFactory
