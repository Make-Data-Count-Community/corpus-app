const request = require('./axios')

module.exports = {
  dataciteApi: (url, headers = {}) => {
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
    // eslint-disable-next-line no-param-reassign
    url = `${url}/transform/application/vnd.crossref.unixsd+xml`

    const response = request({
      url,
      baseURL: 'https://api.crossref.org',
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
