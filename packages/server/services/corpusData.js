/* eslint-disable no-param-reassign */

class CorpusData {
  constructor (seedSource, metadataSource) {
    this.seedSource = seedSource
    this.metdata = metadataSource

    this.metadataFn = citations => Promise.all
      (citations.map(citation => metadataSource.retrieveMetadata(citation))
    )
    .then(() =>  metadataSource.result )
  }

  // eslint-disable-next-line class-methods-use-this
  saveModelToDb() {
    // implement saving to DB
  }

  async execute () {
    const seedSource = await this.seedSource.readSource()

    const result = await this.metadataFn(seedSource.citations)
    return result
  }
}

module.exports = CorpusData
