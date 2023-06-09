const { model: Affiliation } = require('../models/affiliation')
const SearchService = require('../services/search/searchService')

const getAffiliations = ({ input }) => {
  const searchAffiliation = new SearchService(Affiliation, {
    filter: input.search.criteria,
  })

  return searchAffiliation.search()
}

module.exports = {
  getAffiliations,
}
