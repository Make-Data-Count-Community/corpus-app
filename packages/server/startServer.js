/* eslint-disable no-console */
const { startServer } = require('@coko/server')
// const Assertion = require('./models/assertion/assertion')
// const ScheduledTaskService = require('./services/scheduledTaskService')

const init = async () => {
  try {
    // const assertion = await Assertion.query().findOne({ id: '88158e23-9e0e-4683-ab18-f6490d2dac98' })

    // console.log(assertion.$toJsonRelated({ recursive: true }));
    return startServer()
  } catch (e) {
    throw new Error(e)
  }
}

init()
