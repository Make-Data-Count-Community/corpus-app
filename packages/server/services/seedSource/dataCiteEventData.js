/* eslint-disable no-await-in-loop */
class DataCiteEventData {
  static BASE_URL = 'https://api.datacite.org/events?page[cursor]=1&page[size]=1&source-id=crossref,datacite-crossref&citation-type=Dataset-ScholarlyArticle'
  
  constructor(axios) {
    this.axios = axios
    this.citations = []
  }

  async readSource () {

    const getData = await this.getNextData()

    let data
    let hasNext = true
  
    while (hasNext) {
      const result = getData.next(data)
      
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < result.value.length; i++) {
        this.citations.push(result.value[i])
      }

      hasNext = !result.done
    }

    return this.citations
  }

  async *getNextData(url) {
    let nextUrl = url || DataCiteEventData.BASE_URL

    while (nextUrl) {
      // eslint-disable-next-line no-console
      const response = await this.axios.get(nextUrl)
      yield response
      nextUrl = response.data.links.next
    }
  }


}
  
module.exports = DataCiteEventData