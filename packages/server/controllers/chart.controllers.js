const { db } = require('@coko/server')
const { intersectionBy } = require('lodash')
const SearchService = require('../services/search/searchService')

const {
  model: AssertionLastTenYear,
} = require('../models/assertionLastTenYear')

const { model: Assertion } = require('../models/assertion')

const { model: AssertionSubject } = require('../models/assertionSubject')

const { model: AssertionFunder } = require('../models/assertionFunder')

const {
  model: AssertionAffiliation,
} = require('../models/assertionAffiliation')

const { model: Source } = require('../models/source')

const getAssertionsPerYear = async ({ input }) => {
  const searchedAssertions = new SearchService(AssertionLastTenYear, {
    groupBy: 'year',
    filter: input.search.criteria,
  })

  const results = await searchedAssertions.search(
    db.raw(
      `count(doi) as countDoi, count(accession_number) as accessionumber, year`,
    ),
  )

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

const getAssertionsPerSubject = async ({ input }) => {
  const join = [
    {
      innerJoin: [
        'assertions',
        query => {
          query.on('assertions.id', '=', 'assertions_subjects.assertion_id')
        },
      ],
    },
  ]

  const searchedAssertions = new SearchService(AssertionSubject, {
    join,
    take: 20,
    groupBy: 'subject_id',
    filter: input.search.criteria,
    sort: { field: ['cnt'], direction: 'desc' },
  })

  const results = await searchedAssertions.search(
    db.raw(`count(*) as cnt, subject_id`),
  )

  const chartValues = []
  results.forEach((result, key) => {
    chartValues.push({
      id: key + 1,
      xField: result.cnt,
      yField: result.subjectId,
    })
  })

  return chartValues
}

const getAssertionsPerPublisher = async ({ input }) => {
  const hasSubject = input.search.criteria.find(
    criteria => criteria.field === 'subjectId',
  )

  const hasFunder = input.search.criteria.find(
    criteria => criteria.field === 'funderId',
  )

  const hasAffiliation = input.search.criteria.find(
    criteria => criteria.field === 'affiliationId',
  )

  let assertions = []

  if (hasSubject) {
    const subjects = new SearchService(AssertionSubject, {
      filter: [hasSubject],
    })

    assertions.push(await subjects.search('assertion_id'))
  }

  if (hasFunder) {
    const funders = new SearchService(AssertionFunder, {
      filter: [hasFunder],
    })

    assertions.push(await funders.search('assertion_id'))
  }

  if (hasAffiliation) {
    const affiliations = new SearchService(AssertionAffiliation, {
      filter: [hasAffiliation],
    })

    assertions.push(await affiliations.search('assertion_id'))
  }

  assertions.push('assertion_id')

  assertions = intersectionBy(...assertions)

  if (assertions.length > 0) {
    input.search.criteria.push({
      field: 'id',
      operator: { in: assertions.map(a => a.assertion_id) },
    })
  }

  const searchedAssertions = new SearchService(Assertion, {
    groupBy: 'publisher_id',
    filter: input.search.criteria,
  })

  const results = await searchedAssertions.search(
    db.raw(`count(*) as cnt, publisher_id`),
  )

  const chartValues = []
  results.forEach((result, key) => {
    chartValues.push({
      id: key + 1,
      xField: result.cnt,
      yField: result.subjectId,
    })
  })

  return chartValues
}

const getAssertionCountsPerSource = async () => {
  const results = await Source.query()
  const chartValues = []
  results.forEach((result, key) => {
    chartValues.push({
      id: key + 1,
      xField: result.title,
      yField: result.doiCount,
      stackField: 'Doi',
    })
    chartValues.push({
      id: key + 2,
      xField: result.title,
      yField: result.accessionNumberCount,
      stackField: 'AccessionNumber',
    })
  })

  return chartValues
}

module.exports = {
  getAssertionsPerYear,
  getAssertionsPerSubject,
  getAssertionsPerPublisher,
  getAssertionCountsPerSource,
}
