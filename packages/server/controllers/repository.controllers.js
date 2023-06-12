const { get } = require('lodash')
const { model: Repository } = require('../models/repository')
const SearchService = require('../services/search/searchService')

const getRepositories = ({ input }) => {
  const searchRepositories = new SearchService(Repository, {
    filter: get(input, 'search.criteria', []),
  })

  return searchRepositories.search()
}

module.exports = {
  getRepositories,
}
