/*
 * Changes to this file require rebuilding the image using 'docker-compose -f docker-compose.withexternaldb.cziimport.yml build'
 */
// const dataCitePrefixImport = require('./services/scheduledTaskService/dataCitePrefixImport')

const cziImport = require('./services/scheduledTaskService/cziImport')

const init = async () => {
  try {
    // uncomment this to fetch all prefixes from datacite API and insert into DB
    // NOTE this is not idempotent - prefixes will be duplicated if run multiple times
    // await dataCitePrefixImport()

    await cziImport()
  } catch (e) {
    throw new Error(e)
  }
}

init()
