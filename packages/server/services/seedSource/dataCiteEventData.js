/* eslint-disable no-await-in-loop */
const { logger } = require('@coko/server')
const { model: ActivityLog } = require('../../models/activityLog')

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
    this.counts = 0
  }

  async readSource() {
    const getData = await this.getNextData()

    let data
    let hasNext = true

    while (hasNext) {
      const result = await getData.next(data)

      if (result.done === false) {
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < result.value.data.length; i++) {
          this.citations.push(result.value.data[i])
        }

        await ActivityLog.query().insert({
          action: 'assertion_incoming',
          data: JSON.stringify(result.value.data),
          tableName: 'assertions',
        })
      }

      hasNext = !result.done
    }

    return this.citations
  }

  async *getNextData(url) {
    let nextUrl = url || this.url

    while (nextUrl) {
      this.counts += 1
      // eslint-disable-next-line no-console
      logger.info(`Request to datacite eventData Api: ${nextUrl}`)
      const response = await this.axios.dataciteApi(nextUrl)
      yield response.data
      nextUrl = this.counts > 1 ? null : response.data.links.next
      // nextUrl = response.data.links.next
    }
  }
}

module.exports = DataCiteEventData
