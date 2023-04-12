const { startServer } = require('@coko/server')
const CorpusData = require('./services/corpusData')

const init = async () => {
  try {
    // await CorpusData.create() 
    return startServer()
  } catch (e) {
    throw new Error(e)
  }
}

init()
