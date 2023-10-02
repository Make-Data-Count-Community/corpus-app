/*
 * Changes to this file require rebuilding the image using 'docker-compose -f docker-compose.dataciteimport.yml build'
 */

const dataciteImport = require('./services/scheduledTaskService/dataciteImport')

const init = async () => {
  try {
    await dataciteImport()
  } catch (e) {
    throw new Error(e)
  }
}

init()
