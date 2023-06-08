/* eslint-disable no-await-in-loop */
const { logger, db } = require('@coko/server')
const { model: ActivityLog } = require('../../models/activityLog')
const { model: Source } = require('../../models/source')

class DataCiteEventData {
  constructor(axios, filter = []) {
    this.axios = axios
    this.citations = []

    const options = [
      'page[cursor]=1',
      'page[size]=1000',
      'citation-type=Dataset-ScholarlyArticle',
    ]

    // eslint-disable-next-line no-param-reassign
    filter = filter.concat(options)

    this.url = `/events?${filter.join('&')}`
    // this.counts = 0
  }

  async readSource() {
    const getData = await this.getNextData()

    let data
    let hasNext = true

    while (hasNext) {
      const result = await getData.next(data)

      if (result.done === false) {
        result.value.data = this.filterOutExistingCitations(result.value.data)

        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < result.value.data.length; i++) {
          this.citations.push(result.value.data[i])
        }

        if (result.value.data && result.value.data.length > 0) {
          await ActivityLog.query().insert({
            action: 'assertion_incoming_datacite',
            data: JSON.stringify(result.value.data),
            tableName: 'assertions',
          })
        }
      }

      hasNext = !result.done
    }

    return this.citations
  }

  async *getNextData(url) {
    let nextUrl = url || this.url

    while (nextUrl) {
      // this.counts += 1
      // eslint-disable-next-line no-console
      logger.info(`Request to datacite eventData Api: ${nextUrl}`)
      const response = await this.axios.dataciteApi(nextUrl)
      yield response.data
      // nextUrl = this.counts > 1 ? null : response.data.links.next
      nextUrl = response.data.links.next
    }
  }

  // eslint-disable-next-line class-methods-use-this
  filterOutExistingCitations(data) {
    let result = []
    db.transaction(async trx => {
      const { id } = await Source.query(trx).findOne({
        abbreviation: 'datacite',
      })

      await db
        .raw(
          `CREATE TEMPORARY TABLE temp_assertions (
          id uuid
          source_id uuid,
          obj_id text not null,
          subj_id text not null)
        `,
        )
        .transacting(trx)

      await db('temp_assertions')
        .insert(
          data.map(d => ({
            id: d.id,
            source_id: id,
            obj_id: d.attributes.obj_id,
            subj_id: d.attributes.subj_id,
          })),
        )
        .transacting(trx)

      const notProcessed = await db
        .raw(
          'select id from temp_assertions b left join assertions a on b.obj_id = a.obj_id and b.subj_id = a.subj_id where a.id is null',
        )
        .transacting(trx)

      result = result.concat(notProcessed.map(np => np.id))
    })

    return data.filter(d => result.includes(d.id))
  }
}

module.exports = DataCiteEventData
