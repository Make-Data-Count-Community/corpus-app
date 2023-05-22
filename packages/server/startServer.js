/* eslint-disable no-console */
const { startServer, db } = require('@coko/server')
const getId = require('docker-container-id')
const CorpusDataFactory = require('./services/corpusDataFactory')
const MetadataSource = require('./services/metadata/metadataSource')
const Subject = require('./models')
const Repository = require('./models')
const Journal = require('./models')

const init = async () => {
  try {
    if (process.env.START_MIGRATE_DATA) {
      if (process.env.READ_METADATA) {
        const instanceId = await getId()

        const { rows } = await db.raw(
          `update migration_cursors set proccessed = true, instance_id='${instanceId}', hostname='${process.env.HOSTNAME}' where id = (select id from migration_cursors where proccessed = false order by id asc limit 1) RETURNING "id","end", "start"`,
        )

        const subjects = await Subject.query()
        const repositories = await Repository.query()
        const journals = await Journal.query()
        let count = 1

        // eslint-disable-next-line no-inner-declarations
        async function myAsyncFunction() {
          // Wait for some async operation to complete

          console.log('still running')

          if (rows.length > 0) {
            console.log(`Total items extracted ${count}`)
            await MetadataSource.loadCitationsFromDB(
              rows[0],
              subjects,
              repositories,
              journals,
            )
          }

          count += 1
          // Call the function again to loop forever
          setImmediate(myAsyncFunction)
        }

        // Start the infinite loop
        myAsyncFunction()
      } else if (process.env.START_YEAR && process.env.END_YEAR) {
        const startDate = new Date(process.env.START_YEAR, 0, 1)

        const endDate = new Date(process.env.END_YEAR, 11, 31)

        // eslint-disable-next-line no-unmodified-loop-condition
        for (let d = startDate; d <= endDate; d.setMonth(d.getMonth() + 1)) {
          const year = d.getFullYear()
          const month = (d.getMonth() + 1).toString().padStart(2, '0')

          console.log(`######### ${year} #### ${month} ######### `)

          const corpusdata = CorpusDataFactory.dataciteCrossrefPerDate(
            year,
            month,
          )

          if (process.env.ONLY_READ_DATACITE_EVENT) {
            // eslint-disable-next-line no-await-in-loop
            await corpusdata.seedSource.readSource()
          } else {
            // eslint-disable-next-line no-await-in-loop
            await corpusdata.readSeed()
          }

          corpusdata.transformToAssertionAndSave()
        }
      } else {
        const corpusdata = CorpusDataFactory.dataciteSourceCrossref()

        if (process.env.ONLY_READ_DATACITE_EVENT) {
          await corpusdata.seedSource.readSource()
        } else {
          await corpusdata.readSeed()
        }

        corpusdata.transformToAssertionAndSave()
      }
    }

    return startServer()
  } catch (e) {
    throw new Error(e)
  }
}

init()
