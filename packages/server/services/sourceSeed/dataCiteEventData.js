/* eslint-disable no-await-in-loop */
class DataCiteEventData {
  static BASE_URL = 'https://api.datacite.org/events?page[cursor]=1&page[size]=1000'
  
  constructor(axios) {
    this.axios = axios
  }

  *getNextData(url) {
    let nextUrl = url || DataCiteEventData.BASE_URL

    while (nextUrl) {
      // eslint-disable-next-line no-console
      const response = yield this.axios.get(nextUrl)
      nextUrl = response.data.links.next
      yield response.data.results
    }
  }

}
  
module.exports = DataCiteEventData