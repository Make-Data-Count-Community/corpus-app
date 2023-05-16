/* eslint-disable no-param-reassign */
const SeedSource = require('./seedSource/seedSource')
const MetadataSource = require('./metadata/metadataSource')
const CorpusData = require('./corpusData')

class CorpusDataFactory {
  static dataciteSourceCrossref() {
    const seedSource = SeedSource.createInstanceDatacite(['source-id=crossref'])

    const metadataSource = MetadataSource.createInstance()

    const corpusData = new CorpusData(seedSource, metadataSource)
    return corpusData
  }

  static dataciteCrossrefPerDate(year, month) {
    const seedSource = SeedSource.createInstanceDatacite([
      'source-id=datacite-crossref',
      `year-month=${year}-${month}`,
    ])

    const metadataSource = MetadataSource.createInstance()

    const corpusData = new CorpusData(seedSource, metadataSource)
    return corpusData
  }
}

module.exports = CorpusDataFactory
