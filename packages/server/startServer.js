/* eslint-disable no-console */
const { startServer } = require('@coko/server')

// const ScheduledTaskService = require('./services/scheduledTaskService')

const init = async () => {
  try {
    // await ScheduledTaskService.startMigratingWeekly('0 0 * * 5', {
    //   scheduled: true,
    // })

    return startServer()
  } catch (e) {
    throw new Error(e)
  }
}

init()
