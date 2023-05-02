const { 
  getAssertionsPerYear,
  getAssertionsPerSubject,
  getAssertionsPerPublisher,
  getAssertionCountsPerSource
 } = require('../../controllers/chart.controllers')

const getAssertionsPerYearResolver = async (_, { id, options }) => {
  return getAssertionsPerYear(id, options)
}

const getAssertionsPerSubjectResolver = async (_, { id, options }) => {
  return getAssertionsPerSubject(id, options)
}

const getAssertionsPerPublisherResolver = async (_, { id, options }) => {
  return getAssertionsPerPublisher(id, options)
}

const getAssertionCountsPerSourceResolver = async (_, { id, options }) => {
  return getAssertionCountsPerSource(id, options)
}

module.exports = {
  Query: {
    getAssertionsPerYear: getAssertionsPerYearResolver,
    getAssertionsPerSubject: getAssertionsPerSubjectResolver,
    getAssertionsPerPublisher: getAssertionsPerPublisherResolver,
    getAssertionCountsPerSource: getAssertionCountsPerSourceResolver
  },
  Mutation: {
  },
  Chart: {
  }
}
