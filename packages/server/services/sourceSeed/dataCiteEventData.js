/* eslint-disable no-await-in-loop */
class DataCiteEventData {
  static BASE_URL = 'https://api.datacite.org/events'
  
  constructor(axios) {
    this.axios = axios
  }

  *getNextData(url) {
    let nextUrl = url

    while (nextUrl) {
      const response = yield this.axios.get(nextUrl)
      nextUrl = response.data.nextUrl
      yield response.data.results
    }
  }
  
}
  
module.exports = DataCiteEventData