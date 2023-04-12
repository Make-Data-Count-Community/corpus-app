const SourceSeed = require('./sourceSeed/sourceSeed')
// const Metadata = require('./metadata/metadata')

class CorpusData {
  constructor(sourceSeed) {
    this.sourceSeed = sourceSeed
    this.model = []
  }

  async start() {
    const getData = this.sourceSeed.getNextData()
  
    let data
    let hasNext = true
  
    while (hasNext) {
      const result = getData.next(data)

      if (result.value instanceof Promise) {
        // eslint-disable-next-line no-await-in-loop
        data = await result.value
      } else if (result.value) {
        // process data
        data = null
      }

      // eslint-disable-next-line no-console
      console.log(data)
      // const model = 

      hasNext = !result.done
    }

  }

  // eslint-disable-next-line class-methods-use-this
  saveModelToDb() {
    // implement saving to DB
  }

  static async create() {
    const sourceSeed = await SourceSeed.createInstance('dataciteEventData')
    const corpusData = new CorpusData(sourceSeed)

    // eslint-disable-next-line no-console
    await corpusData.start()
    
    // const metadata = await Metadata.createInstance('datacite')
    // corpusData.model = metadata

    return corpusData
  }
}


module.exports = CorpusData