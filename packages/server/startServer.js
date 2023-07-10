/* eslint-disable no-console */
const { startServer } = require('@coko/server')
// const ScheduledTaskService = require('./services/scheduledTaskService')
const seedSource = require('./services/seedSource/seedSource')

const init = async () => {
  try {
    await seedSource.createInstanceReadS3Czi()
    return startServer()
  } catch (e) {
    throw new Error(e)
  }
}

init()
