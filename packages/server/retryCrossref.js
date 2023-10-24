/*
 * Changes to this file require rebuilding the image using 'docker-compose -f docker-compose.withexternaldb.cziimport.yml build'
 */

const retryCrossref = require('./services/scheduledTaskService/retryCrossref')

const init = async () => {
  try {
    await retryCrossref()
  } catch (e) {
    throw new Error(e)
  }
}

init()
