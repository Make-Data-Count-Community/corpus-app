const { get } = require('lodash')
const { model: Funder } = require('../models/funder')
const SearchService = require('../services/search/searchService')

const getFunders = ({ input }) => {
  const searchFunders = new SearchService(Funder, {
    filter: get(input, 'search.criteria', []),
  })

  return searchFunders.search()
}

module.exports = {
  getFunders,
}
