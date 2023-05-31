/* eslint-disable no-console */
const { startServer, db } = require('@coko/server')
const os = require('os')
const CorpusDataFactory = require('./services/corpusDataFactory')
const MetadataSource = require('./services/metadata/metadataSource')
const { model: ActivityLog } = require('./models/activityLog')

const init = async () => {
  try {
    if (process.env.START_MIGRATE_DATA) {
      if (process.env.READ_METADATA) {
        let result = await db.raw(
          `update migration_cursors set proccessed = true, instance_id='${os.hostname()}', hostname='${
            process.env.HOSTNAME
          }' where id = (select id from migration_cursors where proccessed = false order by id asc limit 1) RETURNING "id","end", "start"`,
        )

        let count = 1

        // eslint-disable-next-line no-inner-declarations
        async function myAsyncFunction() {
          const { start } = result.rows[0] || { start: 0 }
          const { end } = result.rows[0] || { end: 0 }

          const countAssertions = await ActivityLog.query()
            .count({ count: '*' })
            .whereBetween('cursorId', [start, end])
            .andWhere(builder => {
              builder.where('proccessed', '=', false)
              builder.andWhere('done', '=', false)
            })

          if (countAssertions[0].count === '0') {
            result = await db.raw(
              `update migration_cursors set proccessed = true, instance_id='${os.hostname()}', hostname='${
                process.env.HOSTNAME
              }' where id = (select id from migration_cursors where proccessed = false order by id asc limit 1) RETURNING "id","end", "start"`,
            )
          }

          if (result.rows.length > 0) {
            console.log(
              `Total items extracted ${count}/${countAssertions[0].count}`,
            )
            await MetadataSource.loadCitationsFromDB(result.rows[0])
            count += 1
            // Call the function again to loop forever
            setImmediate(myAsyncFunction)
          }
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
