const { model: Repository } = require('../models/repository')
const SearchService = require('../services/search/searchService')

const getRepositories = ({ input }) => {
  const searchRepositories = new SearchService(Repository, {
    filter: input.search.criteria,
  })

  return searchRepositories.search()
}

module.exports = {
  getRepositories,
}
