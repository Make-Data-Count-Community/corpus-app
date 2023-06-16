const {
  getAssertionsPerYear,
  getAssertionsPerSubject,
  getAssertionsPerPublisher,
  getAssertionCountsPerSource,
  getCorpusGrowth,
} = require('../../controllers/chart.controllers')

const getAssertionsPerYearResolver = async (_, input) => {
  return getAssertionsPerYear(input)
}

const getAssertionsPerSubjectResolver = async (_, input) => {
  return getAssertionsPerSubject(input)
}

const getAssertionsPerPublisherResolver = async (_, input) => {
  return getAssertionsPerPublisher(input)
}

const getAssertionCountsPerSourceResolver = async (_, { id, options }) => {
  return getAssertionCountsPerSource(id, options)
}

const getCorpusGrowthResolver = async (_, { id, options }) => {
  return getCorpusGrowth(id, options)
}

module.exports = {
  Query: {
    getAssertionsPerYear: getAssertionsPerYearResolver,
    getAssertionsPerSubject: getAssertionsPerSubjectResolver,
    getAssertionsPerPublisher: getAssertionsPerPublisherResolver,
    getAssertionCountsPerSource: getAssertionCountsPerSourceResolver,
    getCorpusGrowth: getCorpusGrowthResolver,
  },
  Mutation: {},
  Chart: {},
}
