/* eslint-disable no-param-reassign */
/* eslint-disable no-await-in-loop */
const { logger } = require('@coko/server')
const axios = require('../axiosService')
const { model: DatacitePrefix } = require('../../models/datacitePrefix')

class DataCitePrefixData {
  constructor() {
    const options = ['page[cursor]=1', 'page[size]=500']

    this.url = `/prefixes?${options.join('&')}`
    this.prefixes = []
    this.prefixSet = new Set()
  }

  /* This should only be run once */
  async importPrefixesToDB() {
    const getData = await this.getNextData()

    let data
    let hasNext = true

    while (hasNext) {
      const result = await getData.next(data)

      if (result.value && result.value.data && result.value.data.length > 0) {
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < result.value.data.length; i++) {
          const event = result.value.data[i]
          this.prefixes.push({
            prefix: event.attributes.prefix,
          })
        }
      }

      hasNext = !result.done
    }

    await DatacitePrefix.query().insert(this.prefixes)

    logger.info(`Wrote ${this.prefixes.length} prefixes to DB`)
  }

  async *getNextData(url) {
    let nextUrl = url || this.url

    while (nextUrl) {
      // eslint-disable-next-line no-console
      logger.info(`Request to datacite prefix Api: ${nextUrl}`)
      const response = await axios.dataciteApiEvent(nextUrl)
      yield response.data
      nextUrl = response.data.links.next
    }
  }

  /*
   * Create a set of all prefixes for filtering purposes
   */
  async buildPrefixSet() {
    const prefixes = await DatacitePrefix.query()

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < prefixes.length; i++) {
      const prefix = prefixes[i]
      this.prefixSet.add(prefix.prefix)
    }

    logger.info(`Built prefix set with ${this.prefixSet.size} items`)
  }
}

module.exports = DataCitePrefixData
