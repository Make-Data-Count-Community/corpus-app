const {
  getAssertionsPerYear,
  getAssertionsPerSubject,
  getAssertionsPerPublisher,
  getAssertionCountsPerSource,
  getCorpusGrowth,
  getAssertionUniqueCounts,
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

const getAssertionCountsPerSourceResolver = async (_, input) => {
  return getAssertionCountsPerSource(input)
}

const getAssertionUniqueCountsResolver = async (_, input) => {
  return getAssertionUniqueCounts(input)
}

const getCorpusGrowthResolver = async (_, input) => {
  return getCorpusGrowth(input)
}

module.exports = {
  Query: {
    getAssertionsPerYear: getAssertionsPerYearResolver,
    getAssertionsPerSubject: getAssertionsPerSubjectResolver,
    getAssertionsPerPublisher: getAssertionsPerPublisherResolver,
    getAssertionCountsPerSource: getAssertionCountsPerSourceResolver,
    getCorpusGrowth: getCorpusGrowthResolver,
    getAssertionUniqueCounts: getAssertionUniqueCountsResolver,
  },
  Mutation: {},
  Chart: {},
}
