/*
 * Changes to this file require rebuilding the image using 'docker-compose -f docker-compose.withexternaldb.yml build'
 */

/* eslint-disable no-console */
const { startServer } = require('@coko/server')

const init = async () => {
  try {
    return startServer()
  } catch (e) {
    throw new Error(e)
  }
}

init()
