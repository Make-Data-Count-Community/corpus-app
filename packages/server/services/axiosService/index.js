/* eslint-disable no-param-reassign */
const request = require('./axios')

module.exports = {
  dataciteApiEvent: (url, headers = {}) => {
    const response = request({
      url,
      baseURL: 'https://api.datacite.org',
      method: 'get',
      headers: {
        'Content-Type': 'application/json', // TODO datacite prefix api breaks if you include this header
        ...headers,
      },
    })

    return response
  },
  dataciteApiDoi: (url, headers = {}) => {
    url = `${url}?affiliation=true`

    const response = request({
      url,
      baseURL: 'https://api.datacite.org',
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    })

    return response
  },
  crossrefApi: (url, headers = {}) => {
    url = `${url}/transform/application/vnd.crossref.unixsd+xml?mailto:${encodeURIComponent('kuda.siziva@datacite.org')}`

    const response = request({
      url,
      baseURL: 'https://api.crossref.org',
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': `DataCite-Corpus-App/4.0 (https://datacite.org/; mailto:kuda.siziva@datacite.org)`,
        ...headers,
      },
    })

    return response
  },
  crossrefLocalApi: (url, headers = {}) => {
    const response = request({
      url,
      baseURL: 'http://host.docker.internal:8000',
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    })

    return response
  },
  // publisherRequest: (url, method, data = {}, headers = {}) => {
  //   const response = request({
  //     url: `/books/domain-service/${url}`,
  //     method,
  //     data: { ...data },
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Authorization: `Basic ${DOMAIN_TOKEN}`,
  //       ...headers,
  //     },
  //   })

  //   return response
  // },
}
