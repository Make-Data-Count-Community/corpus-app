const request = require('./axios')

const DOMAIN_TOKEN = 'Y29rbzpjb2tvYWxsb3dlZA=='
const AGREEMENT_TOKEN = '7956635914a3bb6e1da10986c9915b1f8bdaf021'

module.exports = {
  domainRequest: (url, method, data = {}, headers = {}) => {
    const response = request({
      url: `/books/domain-service/${url}`,
      method,
      data: { ...data },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${DOMAIN_TOKEN}`,
        ...headers,
      },
    })

    return response
  },
  publisherRequest: (url, method, data = {}, headers = {}) => {
    const response = request({
      url: `/books/domain-service/${url}`,
      method,
      data: { ...data },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${DOMAIN_TOKEN}`,
        ...headers,
      },
    })

    return response
  },
  agreementRequest: (domain, method = 'GET', data = {}, headers = {}) => {
    const response = request({
      clientOptions: {
        baseURL: 'https://www.ncbi.nlm.nih.gov',
      },
      url: `/books/publisherportal/api/agreement_journals/?is_current=true&agreement__is_current=true&journal__pmc_domain=${domain}`,
      method,
      data: { ...data },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${AGREEMENT_TOKEN}`,
        ...headers,
      },
    })

    return response
  },
}
