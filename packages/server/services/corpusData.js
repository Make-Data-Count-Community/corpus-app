/* eslint-disable no-param-reassign */
const { useTransaction } = require('@coko/server')
const { model: Assertion } = require('../models/assertion')

class CorpusData {
  constructor(seedSource, metadataSource) {
    this.seedSource = seedSource
    this.metadataSource = metadataSource
    this.result = []
  }

  async transformToAssertionAndSave() {
    const assertions = []
    // console.log(JSON.stringify(this.result))

    useTransaction(async trx => {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < this.result.length; i++) {
        const assertion = {}
        const chunk = this.result[i]
        // eslint-disable-next-line no-await-in-loop
        await Promise.all(
          this.metadataSource.streamApis.map(api =>
            api.transformToAssertion(assertion, chunk, trx),
          ),
        )
        assertions.push(assertion)
      }

      await Assertion.query(trx).insert(assertions)
    })
  }

  async readSeed() {
    const citations = await this.seedSource.readSource()

    citations.forEach((citation, index) => {
      const assertions = {
        event: citation,
        datacite: {},
        crossref: {},
      }

      this.metadataSource.startStreamCitations(assertions)
    })

    this.metadataSource.startStreamCitations(null)

    try {
      this.result = await this.metadataSource.getResult
      return this.result
    } catch (e) {
      throw new Error(e)
    }
  }
}

module.exports = CorpusData
