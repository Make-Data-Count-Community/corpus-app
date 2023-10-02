const { get } = require('lodash')
const { model: Publisher } = require('../models/publisher')
const SearchService = require('../services/search/searchService')

const getPublishers = async ({ input }) => {
  const searchPublishers = new SearchService(Publisher, {
    filter: get(input, 'search.criteria', []),
  })

  return searchPublishers.search()
}

module.exports = {
  getPublishers,
}
