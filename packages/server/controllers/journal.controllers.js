const { get } = require('lodash')
const { model: Journal } = require('../models/journal')
const SearchService = require('../services/search/searchService')

const getJournals = async ({ input }) => {
  const searchJournals = new SearchService(Journal, {
    filter: get(input, 'search.criteria', []),
  })

  return searchJournals.search()
}

module.exports = {
  getJournals,
}
