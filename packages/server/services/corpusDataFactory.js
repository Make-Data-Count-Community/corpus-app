/* eslint-disable no-param-reassign */
const SeedSource = require('./seedSource/seedSource')
const MetadataSource = require('./metadata/metadataSource')
const CorpusData = require('./corpusData')

module.exports = seedSourceType => {
    const seedSource = SeedSource.createInstance(seedSourceType)

    const metadataSource = MetadataSource.createInstance()
  
    const corpusData = new CorpusData(seedSource, metadataSource)
    return corpusData
}