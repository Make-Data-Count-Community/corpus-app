/* eslint-disable no-await-in-loop */
const { cron, db } = require('@coko/server')
const { model: ActivityLog } = require('../../models/activityLog')
const CorpusDataFactory = require('../corpusDataFactory')
const MetadataSource = require('../metadata/metadataSource')
const Source = require('../../models/source/source')
const Assertion = require('../../models/assertion/assertion')

class ScheduledTaskService {
  static async startMigratingWeekly(crontab, options) {
    const task = cron.schedule(
      crontab,
      async () => {
        const startDate = new Date(process.env.START_YEAR, 0, 1)

        const endDate = new Date(new Date().getFullYear(), 11, 31)

        let corpusdata = null

        // eslint-disable-next-line no-unmodified-loop-condition
        for (let d = startDate; d <= endDate; d.setMonth(d.getMonth() + 1)) {
          const year = d.getFullYear()
          const month = (d.getMonth() + 1).toString().padStart(2, '0')

          // eslint-disable-next-line no-console
          console.log(`######### ${year} #### ${month} ######### `)

          // eslint-disable-next-line no-await-in-loop
          corpusdata = await CorpusDataFactory.dataciteCrossrefPerDate(
            year,
            month,
          )

          // eslint-disable-next-line no-await-in-loop
          await corpusdata.seedSource.readSource()
        }

        corpusdata = await CorpusDataFactory.dataciteSourceCrossref()
        await corpusdata.seedSource.readSource()

        async function myAsyncFunction() {
          await MetadataSource.loadCitationsFromDB()

          const countAssertions = await ActivityLog.query()
            .count({ count: '*' })
            .andWhere(builder => {
              builder.where('proccessed', '=', false)
              builder.andWhere('done', '=', false)
            })

          if (countAssertions[0].count !== '0') {
            setImmediate(myAsyncFunction)
          }
        }

        myAsyncFunction()

        await db.schema.refreshMaterializedView('last_10_years_assertions')

        const sourceAssertions = await Assertion.query()
          .select(
            db.raw(
              'count(doi) as doicnt, count(accession_number) as doiaccessionnumer, source_id',
            ),
          )
          .groupBy('source_id')

        await Promise.all(
          sourceAssertions.map(assertion =>
            Source.query().findOne({ id: assertion.source_id }).patch({
              doiCount: assertion.doicnt,
              accessionNumberCount: assertion.doiaccessionnumer,
            }),
          ),
        )
      },
      options,
    )

    task.start()
  }
}

module.exports = ScheduledTaskService
