const { db } = require('@coko/server')
const SearchService = require('../services/search/searchService')

const {
  model: AssertionLastTenYear,
} = require('../models/assertionLastTenYear')

const getAssertionsPerYear = async ({ input }) => {
  // eslint-disable-next-line no-console
  console.time('dbfetch')

  const searchedAssertions = new SearchService(AssertionLastTenYear, {
    groupBy: 'year',
    filter: input.search.criteria,
  })

  const results = await searchedAssertions.search(
    db.raw(
      `count(doi) as countDoi, count(accession_number) as accessionumber, year`,
    ),
  )

  // eslint-disable-next-line no-console
  console.timeEnd('dbfetch')
  const chartValues = []
  results.forEach((result, key) => {
    chartValues.push({
      id: key + 1,
      xField: result.year,
      yField: result.countdoi,
      stackField: 'Doi',
    })
    chartValues.push({
      id: key + 2,
      xField: result.year,
      yField: result.accessionumber,
      stackField: 'AccessionNumber',
    })
  })

  return chartValues
}

const getAssertionsPerSubject = () => {}

const getAssertionsPerPublisher = () => {}

const getAssertionCountsPerSource = () => {}

module.exports = {
  getAssertionsPerYear,
  getAssertionsPerSubject,
  getAssertionsPerPublisher,
  getAssertionCountsPerSource,
}
