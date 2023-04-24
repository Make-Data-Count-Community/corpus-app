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

  async execute () {
    const citations = await this.seedSource.readSource()

    // eslint-disable-next-line no-console
    const result = await this.metadataFn(citations)
    return result
  }
}

module.exports = CorpusData
