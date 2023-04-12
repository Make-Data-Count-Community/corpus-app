const request = require('./axios')

module.exports = {
  get: (url, headers = {}) => {
    const response = request({
      url,
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
