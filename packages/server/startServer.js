const { startServer } = require('@coko/server')
const CorpusDataFactory = require('./services/corpusDataFactory')

const init = async () => {
  try {
    const corpusdata = CorpusDataFactory('dataciteEventData') 
    await corpusdata.execute()
    return startServer()
  } catch (e) {
    throw new Error(e)
  }
}

init()
