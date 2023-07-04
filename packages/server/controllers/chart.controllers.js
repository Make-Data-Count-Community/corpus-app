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

const buildQueryForIntermediateTables = async (
  input,
  sourceTable = 'assertions',
) => {
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
      field: `${sourceTable}.id`,
      operator: { in: assertions.map(a => a.assertionId) },
    })
  }

  return criteria
}

const getAssertionsPerYear = async ({ input }) => {
  const criteria = await buildQueryForIntermediateTables(
    input,
    AssertionLastTenYear.tableName,
  )

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
      type: 'doi',
    })
    chartValues.push({
      id: uuid(),
      xField: result.year,
      yField: result.accessionumber,
      stackField: 'Accession Number',
      type: 'accessionNumber',
    })
  })

  const currentYear = new Date().getFullYear()

  // Loop through each year for the last 10 years
  // eslint-disable-next-line no-plusplus
  for (let year = currentYear - 9; year <= currentYear; year++) {
    const hasDoi = chartValues.find(
      chart => parseInt(chart.xField, 10) === year && chart.type === 'doi',
    )

    const hasAccessionNumber = chartValues.find(
      chart =>
        parseInt(chart.xField, 10) === year && chart.type === 'accessionNumber',
    )

    if (!hasDoi) {
      chartValues.push({
        id: uuid(),
        xField: year.toString(),
        yField: '0',
        stackField: 'DOI',
        type: 'doi',
      })
    }

    if (!hasAccessionNumber) {
      chartValues.push({
        id: uuid(),
        xField: year.toString(),
        yField: '0',
        stackField: 'Accession Number',
        type: 'accessionNumber',
      })
    }
  }

  return chartValues
}

const getAssertionsPerSubject = async ({ input }) => {
  const criteria = await buildQueryForIntermediateTables(input)

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
  let total = 0
  results.forEach((result, key) => {
    if (key > 19) {
      total += parseInt(result.cnt, 10)
    } else {
      const { title } = subjects.find(subj => subj.id === result.subjectId)
      chartValues.push({
        id: uuid(),
        xField: title,
        yField: result.cnt,
      })
    }
  })

  if (chartValues.length > 19) {
    chartValues.push({
      id: uuid(),
      xField: 'others',
      yField: total,
    })
  }

  return chartValues
}

const getAssertionsPerPublisher = async ({ input }) => {
  const criteria = await buildQueryForIntermediateTables(input)

  criteria.push({
    field: 'publisherId',
    operator: { noteq: null },
  })

  const searchedAssertions = new SearchService(Assertion, {
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
  let total = 0
  results.forEach((result, key) => {
    if (key > 19) {
      total += parseInt(result.cnt, 10)
    } else {
      const { title } = publishers.find(subj => subj.id === result.publisherId)
      chartValues.push({
        id: uuid(),
        xField: title,
        yField: result.cnt,
      })
    }
  })

  if (chartValues.length > 19) {
    chartValues.push({
      id: uuid(),
      xField: 'others',
      yField: total,
    })
  }

  return chartValues
}

const getAssertionCountsPerSource = async ({ input }) => {
  const criteria = await buildQueryForIntermediateTables(input)
  let results = await Source.query()

  if (criteria.length > 0) {
    const sourceResults = results

    const searchedAssertions = new SearchService(Assertion, {
      groupBy: 'source_id',
      filter: criteria,
    })

    results = await searchedAssertions.search(
      db.raw(
        `count(doi) as doiCount, count(accession_number) as accessionNumberCount , source_id`,
      ),
    )

    results = results.map(result => ({
      doiCount: result.doicount,
      accessionNumberCount: result.accessionnumbercount,
      title: sourceResults.find(src => src.id === result.sourceId).title,
    }))
  }

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

const getAssertionUniqueCounts = async () => {
  const results = await db.raw(
    "select SUM(CASE WHEN abbreviation = 'datacite' THEN count else 0 end) as datacite_count, SUM(CASE WHEN abbreviation != 'datacite' THEN count else 0 end) as others_count, facet  from public.facet_unique_counts inner join sources s on source_id = s.id group by facet",
  )

  const chartValues = []
  results.rows.forEach((result, key) => {
    chartValues.push({
      id: uuid(),
      facet: result.facet.charAt(0).toUpperCase() + result.facet.slice(1),
      key: result.facet,
      pidMetadata: parseInt(result.datacite_count, 10),
      thirdPartyAggr: parseInt(result.others_count, 10),
      total:
        parseInt(result.datacite_count, 10) + parseInt(result.others_count, 10),
    })
  })

  return chartValues
}

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
