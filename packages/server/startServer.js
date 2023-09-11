/*
* Changes to this file require rebuilding the image using 'docker-compose -f docker-compose.withexternaldb.yml build' 
*/

/* eslint-disable no-console */
const { startServer } = require('@coko/server')
// const Assertion = require('./models/assertion/assertion')
//const dataCitePrefixImport = require('./services/scheduledTaskService/dataCitePrefixImport')
const updateSourceDoiCount = require('./services/scheduledTaskService/updateSourceDoiCount')

const cziImport = require('./services/scheduledTaskService/cziImport')

const init = async () => {
  try {
    //uncomment this to fetch all prefixes from datacite API and insert into DB
    //NOTE this is not idempotent - prefixes will be duplicated if run multiple times
    //await dataCitePrefixImport()

    await cziImport()

    //after a data migration, run this update source doi count fields
    //await updateSourceDoiCount()

    // console.log(assertion.$toJsonRelated({ recursive: true }));
    return startServer()
  } catch (e) {
    throw new Error(e)
  }
}

init()
