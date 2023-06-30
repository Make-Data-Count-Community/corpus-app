/* eslint-disable no-param-reassign */
const SeedSource = require('./seedSource/seedSource')
const MetadataSource = require('./metadata/metadataSource')
const CorpusData = require('./corpusData')

class CorpusDataFactory {
  static async dataciteSourceCrossref() {
    const seedSource = await SeedSource.createInstanceDatacite([
      'source-id=crossref',
    ])

    const metadataSource = await MetadataSource.createInstance()

    const corpusData = new CorpusData(seedSource, metadataSource)
    return corpusData
  }

  static async dataciteCrossrefPerDate(year, month) {
    const seedSource = await SeedSource.createInstanceDatacite([
      'source-id=datacite-crossref',
      `year-month=${year}-${month}`,
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

  static async loadDataFromDB() {
    const metadataSource = await MetadataSource.createInstance()

    const corpusData = new CorpusData(null, metadataSource)

    await corpusData.loadCitationsFromDB()

    return corpusData
  }
}

module.exports = CorpusDataFactory
