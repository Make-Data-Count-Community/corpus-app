/* eslint-disable no-console */
const { startServer } = require('@coko/server')
// const Assertion = require('./models/assertion/assertion')
const dataCitePrefixImport = require('./services/scheduledTaskService/dataCitePrefixImport')

const init = async () => {
  try {
    //uncomment this to fetch all prefixes from datacite API and insert into DB
    //NOTE this is not idempotent - prefixes will be duplicated if run multiple times
    //await dataCitePrefixImport()

    // console.log(assertion.$toJsonRelated({ recursive: true }));
    return startServer()
  } catch (e) {
    throw new Error(e)
  }
}

init()
