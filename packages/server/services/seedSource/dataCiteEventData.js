/* eslint-disable no-param-reassign */
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
        result.value.data = await this.filterOutExistingCitations(
          result.value.data,
        )
        const currentBulk = []

        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < result.value.data.length; i++) {
          const event = result.value.data[i]
          const sourceId = event.attributes['source-id']

          let dataCiteDoi = null
          let crossrefDoi = null

          if (sourceId === 'datacite-crossref') {
            dataCiteDoi = event.attributes['subj-id'].replace(
              'https://doi.org/',
              '',
            )
          } else {
            dataCiteDoi = event.attributes['obj-id'].replace(
              'https://doi.org/',
              '',
            )
          }

          if (sourceId === 'crossref') {
            crossrefDoi = event.attributes['subj-id'].replace(
              'https://doi.org/',
              '',
            )
          } else {
            crossrefDoi = event.attributes['obj-id'].replace(
              'https://doi.org/',
              '',
            )
          }

          const citation = { dataCiteDoi, crossrefDoi, ...result.value.data[i] }
          this.citations.push(citation)
          currentBulk.push(citation)
        }

        if (currentBulk.length > 0) {
          await ActivityLog.query().insert({
            action: 'assertion_incoming_datacite',
            data: JSON.stringify(currentBulk),
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
      const response = await this.axios.dataciteApiEvent(nextUrl)
      yield response.data
      // nextUrl = this.counts > 1 ? null : response.data.links.next
      nextUrl = response.data.links.next
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async filterOutExistingCitations(data) {
    let result = []
    await db.transaction(async trx => {
      const { id } = await Source.query(trx).findOne({
        abbreviation: 'datacite',
      })

      await db
        .raw(
          `CREATE TEMPORARY TABLE temp_assertions (
          id uuid,
          source_id uuid,
          obj_id text not null,
          subj_id text not null
          ) ON COMMIT DROP;
        `,
        )
        .transacting(trx)

      await db('temp_assertions')
        .insert(
          data.map(d => ({
            id: d.id,
            source_id: id,
            obj_id: d.attributes['obj-id'],
            subj_id: d.attributes['subj-id'],
          })),
        )
        .transacting(trx)

      const notProcessed = await db
        .raw(
          'select b.id from temp_assertions b left join assertions a on b.obj_id = a.obj_id and b.subj_id = a.subj_id where a.id is null',
        )
        .transacting(trx)

      result = result.concat(notProcessed.rows.map(np => np.id))
    })

    return data.filter(d => result.includes(d.id))
  }
}

module.exports = DataCiteEventData
