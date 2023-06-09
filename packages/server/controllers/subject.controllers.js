const { model: Subject } = require('../models/subject')
const SearchService = require('../services/search/searchService')

const getSubjects = ({ input }) => {
  const searchSubjects = new SearchService(Subject, {
    filter: input.search.criteria,
  })

  return searchSubjects.search()
}

module.exports = {
  getSubjects,
}
