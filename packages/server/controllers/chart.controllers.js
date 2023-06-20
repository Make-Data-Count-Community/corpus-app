const { db, uuid } = require('@coko/server')
const { intersectionBy, get } = require('lodash')
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

const { model: Subject } = require('../models/subject')

const { model: Publisher } = require('../models/publisher')

const buildQueryForIntermediateTables = async input => {
  let criteria = get(input, 'search.criteria', [])

  const hasSubject = criteria.find(crit => crit.field === 'subjectId')

  const hasFunder = criteria.find(crit => crit.field === 'funderId')

  const hasAffiliation = criteria.find(crit => crit.field === 'affiliationId')

  let assertions = []

  if (hasSubject) {
    const subjects = new SearchService(AssertionSubject, {
      filter: [hasSubject],
    })

    assertions.push(await subjects.search('assertion_id'))

    criteria = criteria.filter(crit => crit.field !== 'subjectId')
  }

  if (hasFunder) {
    const funders = new SearchService(AssertionFunder, {
      filter: [hasFunder],
    })

    assertions.push(await funders.search('assertion_id'))

    criteria = criteria.filter(crit => crit.field !== 'funderId')
  }

  if (hasAffiliation) {
    const affiliations = new SearchService(AssertionAffiliation, {
      filter: [hasAffiliation],
    })

    assertions.push(await affiliations.search('assertion_id'))

    criteria = criteria.filter(crit => crit.field !== 'affiliationId')
  }

  assertions.push('assertion_id')

  assertions = intersectionBy(...assertions)

  if (assertions.length > 0) {
    criteria.push({
      field: 'id',
      operator: { in: assertions.map(a => a.assertionId) },
    })
  }

  return criteria
}

const getAssertionsPerYear = async ({ input }) => {
  const criteria = await buildQueryForIntermediateTables(input)

  const searchedAssertions = new SearchService(AssertionLastTenYear, {
    groupBy: 'year',
    filter: criteria,
  })

  const results = await searchedAssertions.search(
    db.raw(
      `count(doi) as countDoi, count(accession_number) as accessionumber, year`,
    ),
  )

  const chartValues = []
  results.forEach((result, key) => {
    chartValues.push({
      id: uuid(),
      xField: result.year,
      yField: result.countdoi,
      stackField: 'DOI',
    })
    chartValues.push({
      id: uuid(),
      xField: result.year,
      yField: result.accessionumber,
      stackField: 'Accession Number',
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

  const criteria = get(input, 'search.criteria', [])

  const searchedAssertions = new SearchService(AssertionSubject, {
    join,
    take: 20,
    groupBy: 'subject_id',
    filter: criteria,
    sort: { field: ['cnt'], direction: 'desc' },
  })

  const results = await searchedAssertions.search(
    db.raw(`count(*) as cnt, subject_id`),
  )

  const subjectIds = results.map(result => result.subjectId)

  const subjects = await Subject.query().whereIn('id', subjectIds)

  const chartValues = []
  results.forEach((result, key) => {
    const { title } = subjects.find(subj => subj.id === result.subjectId)
    chartValues.push({
      id: uuid(),
      xField: title,
      yField: result.cnt,
    })
  })

  return chartValues
}

const getAssertionsPerPublisher = async ({ input }) => {
  const criteria = await buildQueryForIntermediateTables(input)

  criteria.push({
    field: 'publisherId',
    operator: { noteq: null },
  })

  const searchedAssertions = new SearchService(Assertion, {
    take: 20,
    groupBy: 'publisher_id',
    filter: criteria,
    sort: { field: ['cnt'], direction: 'desc' },
  })

  const results = await searchedAssertions.search(
    db.raw(`count(*) as cnt, publisher_id`),
  )

  const publisherIds = results.map(result => result.publisherId)

  const publishers = await Publisher.query().whereIn('id', publisherIds)

  const chartValues = []
  results.forEach((result, key) => {
    const { title } = publishers.find(subj => subj.id === result.publisherId)
    chartValues.push({
      id: uuid(),
      xField: title,
      yField: result.cnt,
    })
  })

  return chartValues
}

const getAssertionCountsPerSource = async () => {
  const results = await Source.query()
  const chartValues = []
  results.forEach((result, key) => {
    chartValues.push({
      id: uuid(),
      xField: result.title,
      yField: result.doiCount,
      stackField: 'DOI',
    })
    chartValues.push({
      id: uuid(),
      xField: result.title,
      yField: result.accessionNumberCount,
      stackField: 'Accession Number',
    })
  })

  return chartValues
}

const getAssertionUniqueCounts = async () => {}

const getCorpusGrowth = async () => {
  const results = await db.raw(
    "select  date_trunc('week', created) AS weekly, sum(count_doi) as sum_doi, sum(count_accession_number) as sum_accession_number from count_growth_per_day cgpd group by weekly",
  )

  const chartValues = []
  results.rows.forEach((result, key) => {
    chartValues.push({
      id: uuid(),
      xField: result.weekly,
      yField: result.sum_doi,
      stackField: 'DOI',
    })
    chartValues.push({
      id: uuid(),
      xField: result.weekly,
      yField: result.sum_accession_number,
      stackField: 'Accession Number',
    })
  })

  return chartValues
}

module.exports = {
  getAssertionsPerYear,
  getAssertionsPerSubject,
  getAssertionsPerPublisher,
  getAssertionCountsPerSource,
  getAssertionUniqueCounts,
  getCorpusGrowth,
}
