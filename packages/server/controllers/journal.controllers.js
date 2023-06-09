const { model: Journal } = require('../models/journal')
const SearchService = require('../services/search/searchService')

const getJournals = async ({ input }) => {
  const searchJournals = new SearchService(Journal, {
    filter: input.search.criteria,
  })

  return searchJournals.search()
}

module.exports = {
  getJournals,
}
