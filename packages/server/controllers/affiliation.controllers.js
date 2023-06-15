const { get } = require('lodash')
const { model: Affiliation } = require('../models/affiliation')
const SearchService = require('../services/search/searchService')

const getAffiliations = ({ input }) => {
  const searchAffiliation = new SearchService(Affiliation, {
    filter: get(input, 'search.criteria', []),
  })

  return searchAffiliation.search()
}

module.exports = {
  getAffiliations,
}
