import React, { useEffect, useState } from 'react'
import { lorem } from 'faker'
import { uuid } from '@coko/client'
import { json2csv } from 'json-2-csv'

import { Dashboard } from '../../app/ui'

const facetNotSelectedLabel = 'Please select a facet'
const displayListEmptyLabel = 'No matches found'

const downloadFile = (inputData, fileName) => {
  const url = window.URL.createObjectURL(new Blob([inputData]))

  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', fileName)

  document.body.appendChild(link)

  link.click()

  link.parentNode.removeChild(link)
}

const randomNumber = ceiling => {
  return Math.floor(Math.random() * ceiling)
}

const groupBy = (xs, key) => {
  return xs.reduce((rv, x) => {
    // eslint-disable-next-line no-param-reassign
    ;(rv[x[key]] = rv[x[key]] || []).push(x)
    return rv
  }, {})
}

const transformChartData = (sourceData, transformBy, keyField, valueField) => {
  const result = []

  const groupedData = groupBy(sourceData, transformBy)

  Object.entries(groupedData).forEach(([groupedKey, groupedValue]) => {
    const workingObject = {}
    let total = 0
    workingObject[transformBy] = groupedKey

    groupedValue.forEach(transformedRaw => {
      const key = transformedRaw[keyField]
      workingObject[key] = transformedRaw[valueField]
      total += transformedRaw[valueField]
    })

    workingObject.total = total
    workingObject.key = groupedKey

    result.push(workingObject)
  })

  return result
}

// #region corpusGrowth

const corpusGrowthData = [
  { month: '01/2023', value: randomNumber(100000), type: 'DOI' },
  { month: '02/2023', value: randomNumber(1000000), type: 'DOI' },
  { month: '03/2023', value: randomNumber(10000000), type: 'DOI' },
  { month: '04/2023', value: randomNumber(50000000), type: 'DOI' },
  { month: '01/2023', value: randomNumber(100000), type: 'Accession ID' },
  { month: '02/2023', value: randomNumber(1000000), type: 'Accession ID' },
  { month: '03/2023', value: randomNumber(10000000), type: 'Accession ID' },
  { month: '04/2023', value: randomNumber(50000000), type: 'Accession ID' },
]

const corpusGrowthTableColumns = [
  {
    title: 'Month',
    dataIndex: 'month',
    key: 'month',
  },
  {
    title: 'DOI',
    dataIndex: 'DOI',
    key: 'doi',
    render: value =>
      value?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || 0,
  },
  {
    title: 'Accession ID',
    dataIndex: 'Accession ID',
    key: 'accession',
    render: value =>
      value?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || 0,
  },
  {
    title: 'Total',
    dataIndex: 'total',
    key: 'total',
    render: value =>
      value?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || 0,
  },
]

const corpusGrowthDefaultTab = 'table'

// #endregion corpusGrowth

// #region uniqueCount

const transformUniqueCountData = sourceData => {
  return sourceData.map(s => {
    const total = s.pidMetadata + s.thirdPartyAggr
    return { ...s, key: s.facet, total }
  })
}

const unqiueCountData = [
  {
    facet: 'Journal',
    thirdPartyAggr: randomNumber(10000000),
    pidMetadata: randomNumber(10000000),
  },
  {
    facet: 'Repository',
    thirdPartyAggr: randomNumber(10000000),
    pidMetadata: randomNumber(10000000),
  },
  {
    facet: 'Affiliations',
    thirdPartyAggr: randomNumber(10000000),
    pidMetadata: randomNumber(10000000),
  },
  {
    facet: 'Subject',
    thirdPartyAggr: randomNumber(10000000),
    pidMetadata: randomNumber(10000000),
  },
  {
    facet: 'Funder',
    thirdPartyAggr: randomNumber(10000000),
    pidMetadata: randomNumber(10000000),
  },
]

const uniqueCountColumns = [
  {
    title: 'Facet',
    dataIndex: 'facet',
    key: 'facet',
  },
  {
    title: 'Third party aggregator',
    dataIndex: 'thirdPartyAggr',
    key: 'thirdPartyAggr',
    render: value =>
      value?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || 0,
  },
  {
    title: 'PID Metadata',
    dataIndex: 'pidMetadata',
    key: 'pidMetadata',
    render: value =>
      value?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || 0,
  },
  {
    title: 'Total',
    dataIndex: 'total',
    key: 'total',
    render: value =>
      value?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || 0,
  },
]

const uniqueCountDefaultTab = 'table'

// #endregion uniqueCount

// #region overTime

const generateOverTimeData = () => [
  { year: 2010, value: randomNumber(10000000), type: 'DOI' },
  { year: 2011, value: randomNumber(10000000), type: 'DOI' },
  { year: 2012, value: randomNumber(10000000), type: 'DOI' },
  { year: 2013, value: randomNumber(10000000), type: 'DOI' },
  { year: 2014, value: randomNumber(10000000), type: 'DOI' },
  { year: 2015, value: randomNumber(10000000), type: 'DOI' },
  { year: 2016, value: randomNumber(10000000), type: 'DOI' },
  { year: 2017, value: randomNumber(10000000), type: 'DOI' },
  { year: 2018, value: randomNumber(10000000), type: 'DOI' },
  { year: 2019, value: randomNumber(10000000), type: 'DOI' },
  { year: 2010, value: randomNumber(10000000), type: 'Accession ID' },
  { year: 2011, value: randomNumber(10000000), type: 'Accession ID' },
  { year: 2012, value: randomNumber(10000000), type: 'Accession ID' },
  { year: 2013, value: randomNumber(10000000), type: 'Accession ID' },
  { year: 2014, value: randomNumber(10000000), type: 'Accession ID' },
  { year: 2015, value: randomNumber(10000000), type: 'Accession ID' },
  { year: 2016, value: randomNumber(10000000), type: 'Accession ID' },
  { year: 2017, value: randomNumber(10000000), type: 'Accession ID' },
  { year: 2018, value: randomNumber(10000000), type: 'Accession ID' },
  { year: 2019, value: randomNumber(10000000), type: 'Accession ID' },
]

const overTimeData = generateOverTimeData()

const overTimeTableColumns = [
  {
    title: 'Year',
    dataIndex: 'year',
    key: 'year',
  },
  {
    title: 'DOI',
    dataIndex: 'DOI',
    key: 'doi',
    render: value =>
      value?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || 0,
  },
  {
    title: 'Accession ID',
    dataIndex: 'Accession ID',
    key: 'accession',
    render: value =>
      value?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || 0,
  },
  {
    title: 'Total Citations',
    dataIndex: 'total',
    key: 'total',
    render: value =>
      value?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || 0,
  },
]

const overTimeFilterParams = [
  //   {
  //     isFacetSelected: false,
  //     type: 'doi',
  //     values: [],
  //   },
  //   {
  //     isFacetSelected: false,
  //     type: 'accession',
  //     values: [],
  //   },
  {
    isFacetSelected: false,
    type: 'repository',
    values: [],
  },
  {
    isFacetSelected: false,
    type: 'subject',
    values: [],
  },
  {
    isFacetSelected: false,
    type: 'affiliation',
    values: [],
  },
  {
    isFacetSelected: false,
    type: 'funder',
    values: [],
  },
  {
    isFacetSelected: false,
    type: 'journal',
    values: [],
  },
  {
    isFacetSelected: false,
    type: 'publisher',
    values: [],
  },
]

const overTimeFullFacetOptions = [
  { type: 'doi', values: [] },
  { type: 'accession', values: [] },
  {
    type: 'repository',
    values: [
      {
        id: uuid(),
        value: `CZI`,
      },
      {
        id: uuid(),
        value: `DataCite Event Data`,
      },
      {
        id: uuid(),
        value: `OpenAIRE`,
      },
    ],
  },
  {
    type: 'subject',
    values: [
      {
        id: uuid(),
        value: `Subject 1 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Subject 2 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Subject 3 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Subject 4 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Subject 5 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Subject 6 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Subject 7 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Subject 8 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Subject 9 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Subject 10 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Subject 11 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Subject 12 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Subject 13 ${lorem.words(2)}`,
      },
    ],
  },
  {
    type: 'journal',
    values: [
      {
        id: uuid(),
        value: `Journal 1 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Journal 2 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Journal 3 ${lorem.words(2)}`,
      },
    ],
  },
  {
    type: 'publisher',
    values: [
      {
        id: uuid(),
        value: `Publisher 1 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Publisher 2 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Publisher 3 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Publisher 4 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Publisher 5 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Publisher 6 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Publisher 7 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Publisher 8 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Publisher 9 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Publisher 10 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Publisher 11 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Publisher 12 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Publisher 13 ${lorem.words(2)}`,
      },
    ],
  },
  {
    type: 'affiliation',
    values: [
      {
        id: uuid(),
        value: `Affiliate 1 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Affiliate 2 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Affiliate 3 ${lorem.words(2)}`,
      },
    ],
  },
  {
    type: 'funder',
    values: [
      {
        id: uuid(),
        value: `Funder 1 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Funder 2 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Funder 3 ${lorem.words(2)}`,
      },
    ],
  },
]

const overTimeDefaultTab = 'chart'

// #endregion overTime

// #region bySubject

const bySubjectParentId = uuid()

const generateBySubjectData = () => [
  { id: bySubjectParentId, name: '', value: 0, parent: null },
  {
    id: uuid(),
    name: 'Subject 0',
    value: randomNumber(1000),
    parent: bySubjectParentId,
  },
  {
    id: uuid(),
    name: 'Subject 1',
    value: randomNumber(1000),
    parent: bySubjectParentId,
  },
  {
    id: uuid(),
    name: 'Subject 2',
    value: randomNumber(1000),
    parent: bySubjectParentId,
  },
  {
    id: uuid(),
    name: 'Subject 3',
    value: randomNumber(1000),
    parent: bySubjectParentId,
  },
  {
    id: uuid(),
    name: 'Subject 4',
    value: randomNumber(1000),
    parent: bySubjectParentId,
  },
  {
    id: uuid(),
    name: 'Subject 5',
    value: randomNumber(1000),
    parent: bySubjectParentId,
  },
  {
    id: uuid(),
    name: 'Subject 6',
    value: randomNumber(1000),
    parent: bySubjectParentId,
  },
  {
    id: uuid(),
    name: 'Subject 7',
    value: randomNumber(1000),
    parent: bySubjectParentId,
  },
  {
    id: uuid(),
    name: 'Subject 8',
    value: randomNumber(1000),
    parent: bySubjectParentId,
  },
  {
    id: uuid(),
    name: 'Subject 9',
    value: randomNumber(1000),
    parent: bySubjectParentId,
  },
  {
    id: uuid(),
    name: 'Subject 10',
    value: randomNumber(1000),
    parent: bySubjectParentId,
  },
  {
    id: uuid(),
    name: 'Subject 11',
    value: randomNumber(1000),
    parent: bySubjectParentId,
  },
  {
    id: uuid(),
    name: 'Subject 12',
    value: randomNumber(1000),
    parent: bySubjectParentId,
  },
  {
    id: uuid(),
    name: 'Subject 13',
    value: randomNumber(1000),
    parent: bySubjectParentId,
  },
  {
    id: uuid(),
    name: 'Subject 14',
    value: randomNumber(1000),
    parent: bySubjectParentId,
  },
  {
    id: uuid(),
    name: 'Subject 15',
    value: randomNumber(1000),
    parent: bySubjectParentId,
  },
  {
    id: uuid(),
    name: 'Subject 16',
    value: randomNumber(1000),
    parent: bySubjectParentId,
  },
  {
    id: uuid(),
    name: 'Subject 17',
    value: randomNumber(1000),
    parent: bySubjectParentId,
  },
  {
    id: uuid(),
    name: 'Subject 18',
    value: randomNumber(1000),
    parent: bySubjectParentId,
  },
  {
    id: uuid(),
    name: 'Subject 19',
    value: randomNumber(1000),
    parent: bySubjectParentId,
  },
]

const bySubjectData = generateBySubjectData()

const bySubjectTableColumns = [
  //   {
  //     title: 'Year',
  //     dataIndex: 'year',
  //     key: 'year',
  //   },
  {
    title: 'Subject',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Total Citations',
    dataIndex: 'value',
    key: 'value',
    render: value =>
      value?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || 0,
  },
]

const bySubjectFilterParams = [
  //   {
  //     isFacetSelected: false,
  //     type: 'doi',
  //     values: [],
  //   },
  //   {
  //     isFacetSelected: false,
  //     type: 'accession',
  //     values: [],
  //   },
  //   {
  //     isFacetSelected: false,
  //     type: 'repository',
  //     values: [],
  //   },
  //   {
  //     isFacetSelected: false,
  //     type: 'subject',
  //     values: [],
  //   },
  //   {
  //     isFacetSelected: false,
  //     type: 'journal',
  //     values: [],
  //   },
  {
    isFacetSelected: false,
    type: 'publisher',
    values: [],
  },
  {
    isFacetSelected: false,
    type: 'affiliation',
    values: [],
  },
  {
    isFacetSelected: false,
    type: 'funder',
    values: [],
  },
]

const bySubjectFullFacetOptions = [
  { type: 'doi', values: [] },
  { type: 'accession', values: [] },
  {
    type: 'repository',
    values: [
      {
        id: uuid(),
        value: `CZI`,
      },
      {
        id: uuid(),
        value: `DataCite Event Data`,
      },
      {
        id: uuid(),
        value: `OpenAIRE`,
      },
    ],
  },
  {
    type: 'subject',
    values: [
      {
        id: uuid(),
        value: `Subject 1 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Subject 2 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Subject 3 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Subject 4 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Subject 5 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Subject 6 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Subject 7 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Subject 8 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Subject 9 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Subject 10 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Subject 11 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Subject 12 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Subject 13 ${lorem.words(2)}`,
      },
    ],
  },
  {
    type: 'journal',
    values: [
      {
        id: uuid(),
        value: `Journal 1 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Journal 2 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Journal 3 ${lorem.words(2)}`,
      },
    ],
  },
  {
    type: 'publisher',
    values: [
      {
        id: uuid(),
        value: `Publisher 1 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Publisher 2 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Publisher 3 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Publisher 4 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Publisher 5 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Publisher 6 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Publisher 7 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Publisher 8 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Publisher 9 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Publisher 10 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Publisher 11 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Publisher 12 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Publisher 13 ${lorem.words(2)}`,
      },
    ],
  },
  {
    type: 'affiliation',
    values: [
      {
        id: uuid(),
        value: `Affiliate 1 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Affiliate 2 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Affiliate 3 ${lorem.words(2)}`,
      },
    ],
  },
  {
    type: 'funder',
    values: [
      {
        id: uuid(),
        value: `Funder 1 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Funder 2 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Funder 3 ${lorem.words(2)}`,
      },
    ],
  },
]

const bySubjectDefaultTab = 'chart'

// #endregion bySubject

// #region byPublisher

const generateByPublisherData = () => [
  { id: uuid(), publisher: 'Publisher 1', value: randomNumber(1000) },
  { id: uuid(), publisher: 'Publisher 2', value: randomNumber(1000) },
  { id: uuid(), publisher: 'Publisher 3', value: randomNumber(1000) },
  { id: uuid(), publisher: 'Publisher 4', value: randomNumber(1000) },
  { id: uuid(), publisher: 'Publisher 5', value: randomNumber(1000) },
  { id: uuid(), publisher: 'Publisher 6', value: randomNumber(1000) },
  { id: uuid(), publisher: 'Publisher 7', value: randomNumber(1000) },
  { id: uuid(), publisher: 'Publisher 8', value: randomNumber(1000) },
  { id: uuid(), publisher: 'Publisher 9', value: randomNumber(1000) },
  { id: uuid(), publisher: 'Publisher 10', value: randomNumber(1000) },
]

const byPublisherData = generateByPublisherData()

const byPublisherTableColumns = [
  {
    title: 'Publisher',
    dataIndex: 'publisher',
    key: 'publisher',
  },
  {
    title: 'Total Citations',
    dataIndex: 'value',
    key: 'value',
    render: value =>
      value?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || 0,
  },
]

const addKeytoData = sourceData => {
  return sourceData.map(s => {
    return { ...s, key: s.id }
  })
}

const byPublisherFilterParams = [
  {
    isFacetSelected: false,
    type: 'repository',
    values: [],
  },
  {
    isFacetSelected: false,
    type: 'subject',
    values: [],
  },
  {
    isFacetSelected: false,
    type: 'affiliation',
    values: [],
  },
  {
    isFacetSelected: false,
    type: 'funder',
    values: [],
  },
]

const byPublisherFullFacetOptions = [
  { type: 'doi', values: [] },
  { type: 'accession', values: [] },
  {
    type: 'repository',
    values: [
      {
        id: uuid(),
        value: `CZI`,
      },
      {
        id: uuid(),
        value: `DataCite Event Data`,
      },
      {
        id: uuid(),
        value: `OpenAIRE`,
      },
    ],
  },
  {
    type: 'subject',
    values: [
      {
        id: uuid(),
        value: `Subject 1 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Subject 2 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Subject 3 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Subject 4 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Subject 5 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Subject 6 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Subject 7 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Subject 8 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Subject 9 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Subject 10 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Subject 11 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Subject 12 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Subject 13 ${lorem.words(2)}`,
      },
    ],
  },
  {
    type: 'journal',
    values: [
      {
        id: uuid(),
        value: `Journal 1 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Journal 2 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Journal 3 ${lorem.words(2)}`,
      },
    ],
  },
  {
    type: 'publisher',
    values: [
      {
        id: uuid(),
        value: `Publisher 1 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Publisher 2 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Publisher 3 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Publisher 4 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Publisher 5 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Publisher 6 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Publisher 7 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Publisher 8 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Publisher 9 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Publisher 10 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Publisher 11 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Publisher 12 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Publisher 13 ${lorem.words(2)}`,
      },
    ],
  },
  {
    type: 'affiliation',
    values: [
      {
        id: uuid(),
        value: `Affiliate 1 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Affiliate 2 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Affiliate 3 ${lorem.words(2)}`,
      },
    ],
  },
  {
    type: 'funder',
    values: [
      {
        id: uuid(),
        value: `Funder 1 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Funder 2 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Funder 3 ${lorem.words(2)}`,
      },
    ],
  },
]

const byPublisherDefaultTab = 'chart'

// #endregion byPublisher

// #region bySource

const generateBySourceData = () => {
  return [
    { source: 'CZI', value: randomNumber(10000000), type: 'DOI' },
    {
      source: 'DataCite Event Data',
      value: randomNumber(10000000),
      type: 'DOI',
    },
    { source: 'OpenAIRE', value: randomNumber(10000000), type: 'DOI' },
    { source: 'CZI', value: randomNumber(10000000), type: 'Accession ID' },
    { source: 'DataCite Event Data', value: 0, type: 'Accession ID' },
    { source: 'OpenAIRE', value: randomNumber(10000000), type: 'Accession ID' },
  ]
}

const bySourceData = generateBySourceData()

const bySourceTableColumns = [
  {
    title: 'Source',
    dataIndex: 'source',
    key: 'source',
  },
  {
    title: 'DOI',
    dataIndex: 'DOI',
    key: 'doi',
    render: value =>
      value?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || 0,
  },
  {
    title: 'Accession ID',
    dataIndex: 'Accession ID',
    key: 'accession',
    render: value =>
      value?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || 0,
  },
  {
    title: 'Total Citations',
    dataIndex: 'total',
    key: 'total',
    render: value =>
      value?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || 0,
  },
]

const bySourceFilterParams = [
  {
    isFacetSelected: false,
    type: 'repository',
    values: [],
  },
  {
    isFacetSelected: false,
    type: 'subject',
    values: [],
  },
  {
    isFacetSelected: false,
    type: 'affiliation',
    values: [],
  },
  {
    isFacetSelected: false,
    type: 'funder',
    values: [],
  },
  {
    isFacetSelected: false,
    type: 'journal',
    values: [],
  },
  {
    isFacetSelected: false,
    type: 'publisher',
    values: [],
  },
]

const bySourceFullFacetOptions = [
  {
    type: 'repository',
    values: [
      {
        id: uuid(),
        value: `CZI`,
      },
      {
        id: uuid(),
        value: `DataCite Event Data`,
      },
      {
        id: uuid(),
        value: `OpenAIRE`,
      },
    ],
  },
  {
    type: 'subject',
    values: [
      {
        id: uuid(),
        value: `Subject 1 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Subject 2 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Subject 3 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Subject 4 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Subject 5 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Subject 6 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Subject 7 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Subject 8 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Subject 9 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Subject 10 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Subject 11 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Subject 12 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Subject 13 ${lorem.words(2)}`,
      },
    ],
  },
  {
    type: 'journal',
    values: [
      {
        id: uuid(),
        value: `Journal 1 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Journal 2 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Journal 3 ${lorem.words(2)}`,
      },
    ],
  },
  {
    type: 'publisher',
    values: [
      {
        id: uuid(),
        value: `Publisher 1 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Publisher 2 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Publisher 3 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Publisher 4 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Publisher 5 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Publisher 6 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Publisher 7 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Publisher 8 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Publisher 9 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Publisher 10 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Publisher 11 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Publisher 12 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Publisher 13 ${lorem.words(2)}`,
      },
    ],
  },
  {
    type: 'affiliation',
    values: [
      {
        id: uuid(),
        value: `Affiliate 1 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Affiliate 2 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Affiliate 3 ${lorem.words(2)}`,
      },
    ],
  },
  {
    type: 'funder',
    values: [
      {
        id: uuid(),
        value: `Funder 1 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Funder 2 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Funder 3 ${lorem.words(2)}`,
      },
    ],
  },
]

const bySourceDefaultTab = 'chart'

// #endregion bySource

const Template = args => {
  const [corpusGrowthSelectedTab, setCorpusGrowthSelectedTab] = useState(
    corpusGrowthDefaultTab,
  )

  const [corpusGrowthIsDowloadListOpen, setCorpusGrowthIsDownloadListOpen] =
    useState(false)

  const [uniqueCountSelectedTab, setUniqueCountSelectedTab] = useState(
    uniqueCountDefaultTab,
  )

  const [uniqueCountIsDowloadListOpen, setUniqueCountIsDownloadListOpen] =
    useState(false)

  // #region bySourceStates

  const [bySourceSelectedTab, setBySourceSelectedTab] =
    useState(bySourceDefaultTab)

  const [bySourceFilters, setBySourceFilters] = useState(bySourceFilterParams)

  const [bySourceDisplayFacetValues, setBySourceDisplayFacetValues] = useState(
    [],
  )

  const [bySourceSelectedFacetValues, setBySourceSelectedFacetValues] =
    useState([])

  const [bySourceShowApplyFilter, setBySourceShowApplyFilter] = useState(false)

  const [bySourceVisualisationData, setBySourceVisualisationData] =
    useState(bySourceData)

  const [bySourceIsFilterOpen, setBySourceIsFilterOpen] = useState(false)

  const [bySourceIsDownloadListOpen, setBySourceIsDownloadListOpen] =
    useState(false)

  const [
    bySourceEmptyFacetValueListLabel,
    setBySourceEmptyFacetValueListLabel,
  ] = useState(facetNotSelectedLabel)

  const setBySourceEmptyListLabel = () => {
    const selectedFacet = bySourceFilters.find(f => f.isFacetSelected)

    setBySourceEmptyFacetValueListLabel(
      !!selectedFacet && bySourceDisplayFacetValues.length === 0
        ? displayListEmptyLabel
        : facetNotSelectedLabel,
    )
  }

  // #endregion bySourceStates

  // #region bySubjectStates

  const [bySubjectSelectedTab, setBySubjectSelectedTab] =
    useState(bySubjectDefaultTab)

  const [bySubjectFilters, setBySubjectFilters] = useState(
    bySubjectFilterParams,
  )

  const [bySubjectDisplayFacetValues, setBySubjectDisplayFacetValues] =
    useState([])

  const [bySubjectSelectedFacetValues, setBySubjectSelectedFacetValues] =
    useState([])

  const [bySubjectShowApplyFilter, setBySubjectShowApplyFilter] =
    useState(false)

  const [bySubjectVisualisationData, setBySubjectVisualisationData] =
    useState(bySubjectData)

  const [bySubjectIsFilterOpen, setBySubjectIsFilterOpen] = useState(false)

  const [bySubjectIsDownloadListOpen, setBySubjectIsDownloadListOpen] =
    useState(false)

  const [
    bySubjectEmptyFacetValueListLabel,
    setBySubjectEmptyFacetValueListLabel,
  ] = useState(facetNotSelectedLabel)

  const setBySubjectEmptyListLabel = () => {
    const selectedFacet = bySubjectFilters.find(f => f.isFacetSelected)

    setBySubjectEmptyFacetValueListLabel(
      !!selectedFacet && bySubjectDisplayFacetValues.length === 0
        ? displayListEmptyLabel
        : facetNotSelectedLabel,
    )
  }

  // #endregion bySubjectStates

  // #region overTimeStates

  const [overTimeSelectedTab, setOverTimeSelectedTab] =
    useState(overTimeDefaultTab)

  const [overTimeFilters, setOverTimeFilters] = useState(overTimeFilterParams)

  const [overTimeDisplayFacetValues, setOverTimeDisplayFacetValues] = useState(
    [],
  )

  const [overTimeSelectedFacetValues, setOverTimeSelectedFacetValues] =
    useState([])

  const [overTimeShowApplyFilter, setOverTimeShowApplyFilter] = useState(false)

  const [overTimeVisualisationData, setOverTimeVisualisationData] =
    useState(overTimeData)

  const [overTimeIsFilterOpen, setOverTimeIsFilterOpen] = useState(false)

  const [overTimeIsDownloadListOpen, setOverTimeIsDownloadListOpen] =
    useState(false)

  const [
    overTimeEmptyFacetValueListLabel,
    setOverTimeEmptyFacetValueListLabel,
  ] = useState(facetNotSelectedLabel)

  const setOverTimeEmptyListLabel = () => {
    const selectedFacet = overTimeFilters.find(f => f.isFacetSelected)

    setOverTimeEmptyFacetValueListLabel(
      !!selectedFacet && overTimeDisplayFacetValues.length === 0
        ? displayListEmptyLabel
        : facetNotSelectedLabel,
    )
  }

  // #endregion overTimeStates

  // #region byPublisherStates

  const [byPublisherSelectedTab, setByPublisherSelectedTab] = useState(
    byPublisherDefaultTab,
  )

  const [byPublisherFilters, setByPublisherFilters] = useState(
    byPublisherFilterParams,
  )

  const [byPublisherDisplayFacetValues, setByPublisherDisplayFacetValues] =
    useState([])

  const [byPublisherSelectedFacetValues, setByPublisherSelectedFacetValues] =
    useState([])

  const [byPublisherShowApplyFilter, setByPublisherShowApplyFilter] =
    useState(false)

  const [byPublisherVisualisationData, setByPublisherVisualisationData] =
    useState(byPublisherData)

  const [byPublisherIsFilterOpen, setByPublisherIsFilterOpen] = useState(false)

  const [byPublisherIsDownloadListOpen, setByPublisherIsDownloadListOpen] =
    useState(false)

  const [
    byPublisherEmptyFacetValueListLabel,
    setByPublisherEmptyFacetValueListLabel,
  ] = useState(facetNotSelectedLabel)

  const setByPublisherEmptyListLabel = () => {
    const selectedFacet = byPublisherFilters.find(f => f.isFacetSelected)

    setByPublisherEmptyFacetValueListLabel(
      !!selectedFacet && byPublisherDisplayFacetValues.length === 0
        ? displayListEmptyLabel
        : facetNotSelectedLabel,
    )
  }

  // #endregion byPublisherStates

  useEffect(() => {
    const storedFilters = JSON.parse(localStorage.getItem('bySourceFilters'))

    if (storedFilters) {
      setBySourceFilters(storedFilters)
    } else {
      localStorage.setItem('bySourceFilters', JSON.stringify(bySourceFilters))
    }

    return () => {
      localStorage.removeItem('bySourceFilters')
    }
  }, [])

  useEffect(setBySourceEmptyListLabel, [bySourceDisplayFacetValues])

  useEffect(() => {
    const storedFilters = JSON.parse(localStorage.getItem('byPublisherFilters'))

    if (storedFilters) {
      setByPublisherFilters(storedFilters)
    } else {
      localStorage.setItem(
        'byPublisherFilters',
        JSON.stringify(byPublisherFilters),
      )
    }

    return () => {
      localStorage.removeItem('byPublisherFilters')
    }
  }, [])

  useEffect(setByPublisherEmptyListLabel, [byPublisherDisplayFacetValues])

  useEffect(() => {
    const storedFilters = JSON.parse(localStorage.getItem('bySubjectFilters'))

    if (storedFilters) {
      setBySubjectFilters(storedFilters)
    } else {
      localStorage.setItem('bySubjectFilters', JSON.stringify(bySubjectFilters))
    }

    return () => {
      localStorage.removeItem('bySubjectFilters')
    }
  }, [])

  useEffect(setBySubjectEmptyListLabel, [bySubjectDisplayFacetValues])

  useEffect(() => {
    const storedFilters = JSON.parse(localStorage.getItem('overTimeFilters'))

    if (storedFilters) {
      setOverTimeFilters(storedFilters)
    } else {
      localStorage.setItem('overTimeFilters', JSON.stringify(overTimeFilters))
    }

    return () => {
      localStorage.removeItem('overTimeFilters')
    }
  }, [])

  useEffect(setOverTimeEmptyListLabel, [overTimeDisplayFacetValues])

  const handleCorpusGrowthFooterTabClick = tabTitle => {
    if (tabTitle === 'download') {
      setCorpusGrowthIsDownloadListOpen(!corpusGrowthIsDowloadListOpen)
    } else {
      setCorpusGrowthSelectedTab(tabTitle)
    }
  }

  const handleCorpusGrowthExpandClick = () => {}

  const handleCorpusGrowthDownloadOptionClick = async type => {
    setCorpusGrowthIsDownloadListOpen(false)

    if (type === 'csv') {
      const csvString = await json2csv(
        transformChartData(corpusGrowthData, 'month', 'type', 'value'),
        {
          keys: [
            { field: 'month', title: 'Month' },
            { field: 'DOI', title: 'DOI' },
            { field: 'Accession ID', title: 'Accession ID' },
            { field: 'total', title: 'Total' },
          ],
        },
      )

      downloadFile(csvString, 'Data citations corpus growth.csv')
    }
  }

  const handleUniqueCountFooterTabClick = tabTitle => {
    if (tabTitle === 'download') {
      setUniqueCountIsDownloadListOpen(!uniqueCountIsDowloadListOpen)
    } else {
      setUniqueCountSelectedTab(tabTitle)
    }
  }

  const handleUniqueCountExpandClick = () => {}

  const handleUniqueCountDownloadOptionClick = () => {}

  // #region bySourceFilters

  const handleBySourceFooterTabClick = tabTitle => {
    if (tabTitle === 'download') {
      setBySourceIsDownloadListOpen(!bySourceIsDownloadListOpen)
    } else {
      setBySourceSelectedTab(tabTitle)
    }
  }

  const handleBySourceApplyFilters = () => {
    setBySourceIsFilterOpen(false)

    localStorage.setItem('bySourceFilters', JSON.stringify(bySourceFilters))

    setBySourceDisplayFacetValues([])
    setBySourceVisualisationData(generateBySourceData())
  }

  const handleBySourceFacetItemClick = facetType => {
    const facetIndex = bySourceFilters.findIndex(f => f.type === facetType)

    setBySourceFilters(
      bySourceFilters.map((f, i) => ({
        ...f,
        isFacetSelected: i === facetIndex,
      })),
    )

    setBySourceDisplayFacetValues(
      bySourceFullFacetOptions.find(f => f.type === facetType).values,
    )

    setBySourceSelectedFacetValues(bySourceFilters[facetIndex].values)
  }

  const handleBySourceFacetValueClick = valueId => {
    const facet = bySourceFilters.find(f => f.isFacetSelected)

    if (facet.values.find(s => s.id === valueId)) {
      facet.values = bySourceSelectedFacetValues.filter(v => v.id !== valueId)
    } else {
      facet.values = [
        ...facet.values,
        bySourceDisplayFacetValues.find(option => option.id === valueId),
      ]
    }

    setBySourceFilters(
      bySourceFilters.map(f =>
        f.type === facet.type ? { ...f, ...{ values: facet.values } } : f,
      ),
    )

    setBySourceSelectedFacetValues(facet.values)

    const storedFilters = JSON.parse(localStorage.getItem('bySourceFilters'))
    let shouldShowApplyButton = false

    storedFilters.forEach(storedFacet => {
      const currentFacet = bySourceFilters.find(
        f => f.type === storedFacet.type,
      )

      if (currentFacet.values.length !== storedFacet.values.length) {
        shouldShowApplyButton = true
      }
    })

    setBySourceShowApplyFilter(shouldShowApplyButton)
  }

  const handleBySourceOnClose = () => {
    setBySourceIsFilterOpen(false)
  }

  const handleBySourceExpandClick = () => {}

  const handleBySourceFilterButtonClick = isOpen => {
    if (isOpen) {
      setBySourceFilters(JSON.parse(localStorage.getItem('bySourceFilters')))
    }

    setBySourceIsFilterOpen(isOpen)
  }

  const handleBySourceSearchChange = rawSearchValue => {
    const searchValue = rawSearchValue.target.value
    const facetType = bySourceFilters.find(f => f.isFacetSelected).type
    const targetFacet = bySourceFullFacetOptions.find(f => f.type === facetType)

    if (searchValue === '') {
      setBySourceDisplayFacetValues(targetFacet.values)
    } else {
      setBySourceDisplayFacetValues(
        targetFacet.values.filter(v =>
          v.value.toLowerCase().includes(searchValue.toLowerCase()),
        ),
      )
    }
  }

  const handleBySourceDownloadOptionClick = async type => {
    setBySourceIsDownloadListOpen(false)

    if (type === 'csv') {
      const csvString = await json2csv(
        transformChartData(
          bySourceVisualisationData,
          'source',
          'type',
          'value',
        ),
        {
          keys: [
            { field: 'source', title: 'Source' },
            { field: 'DOI', title: 'DOI' },
            { field: 'Accession ID', title: 'Accession ID' },
            { field: 'total', title: 'Total Citations' },
          ],
        },
      )

      downloadFile(csvString, 'Citation counts by source of citation.csv')
    }
  }

  // #endregion bySourceFilters

  // #region byPublisherFilters

  const handleByPublisherFooterTabClick = tabTitle => {
    if (tabTitle === 'download') {
      setByPublisherIsDownloadListOpen(!byPublisherIsDownloadListOpen)
    } else {
      setByPublisherSelectedTab(tabTitle)
    }
  }

  const handleByPublisherApplyFilters = () => {
    setByPublisherIsFilterOpen(false)

    localStorage.setItem(
      'byPublisherFilters',
      JSON.stringify(byPublisherFilters),
    )

    setByPublisherDisplayFacetValues([])
    setByPublisherVisualisationData(generateByPublisherData())
  }

  const handleByPublisherFacetItemClick = facetType => {
    const facetIndex = byPublisherFilters.findIndex(f => f.type === facetType)

    setByPublisherFilters(
      byPublisherFilters.map((f, i) => ({
        ...f,
        isFacetSelected: i === facetIndex,
      })),
    )

    setByPublisherDisplayFacetValues(
      byPublisherFullFacetOptions.find(f => f.type === facetType).values,
    )

    setByPublisherSelectedFacetValues(byPublisherFilters[facetIndex].values)
  }

  const handleByPublisherFacetValueClick = valueId => {
    const facet = byPublisherFilters.find(f => f.isFacetSelected)

    if (facet.values.find(s => s.id === valueId)) {
      facet.values = byPublisherSelectedFacetValues.filter(
        v => v.id !== valueId,
      )
    } else {
      facet.values = [
        ...facet.values,
        byPublisherDisplayFacetValues.find(option => option.id === valueId),
      ]
    }

    setByPublisherFilters(
      byPublisherFilters.map(f =>
        f.type === facet.type ? { ...f, ...{ values: facet.values } } : f,
      ),
    )

    setByPublisherSelectedFacetValues(facet.values)

    const storedFilters = JSON.parse(localStorage.getItem('byPublisherFilters'))
    let shouldShowApplyButton = false

    storedFilters.forEach(storedFacet => {
      const currentFacet = byPublisherFilters.find(
        f => f.type === storedFacet.type,
      )

      if (currentFacet.values.length !== storedFacet.values.length) {
        shouldShowApplyButton = true
      }
    })

    setByPublisherShowApplyFilter(shouldShowApplyButton)
  }

  const handleByPublisherOnClose = () => {
    setByPublisherIsFilterOpen(false)
  }

  const handleByPublisherExpandClick = () => {}

  const handleByPublisherFilterButtonClick = isOpen => {
    if (isOpen) {
      setByPublisherFilters(
        JSON.parse(localStorage.getItem('byPublisherFilters')),
      )
    }

    setByPublisherIsFilterOpen(isOpen)
  }

  const handleByPublisherSearchChange = rawSearchValue => {
    const searchValue = rawSearchValue.target.value
    const facetType = byPublisherFilters.find(f => f.isFacetSelected).type

    const targetFacet = byPublisherFullFacetOptions.find(
      f => f.type === facetType,
    )

    if (searchValue === '') {
      setByPublisherDisplayFacetValues(targetFacet.values)
    } else {
      setByPublisherDisplayFacetValues(
        targetFacet.values.filter(v =>
          v.value.toLowerCase().includes(searchValue.toLowerCase()),
        ),
      )
    }
  }

  const handleByPublisherDownloadOptionClick = async type => {
    setByPublisherIsDownloadListOpen(false)

    if (type === 'csv') {
      const csvString = await json2csv(
        addKeytoData(byPublisherVisualisationData),
        {
          keys: [
            { field: 'publisher', title: 'Publisher' },
            { field: 'value', title: 'Total Citations' },
          ],
        },
      )

      downloadFile(csvString, 'Citation counts by publisher.csv')
    }
  }

  // #endregion byPublisherFilters

  // #region bySubjectFilters

  const handleBySubjectFooterTabClick = tabTitle => {
    if (tabTitle === 'download') {
      setBySubjectIsDownloadListOpen(!bySubjectIsDownloadListOpen)
    } else {
      setBySubjectSelectedTab(tabTitle)
    }
  }

  const handleBySubjectApplyFilters = () => {
    setBySubjectIsFilterOpen(false)

    localStorage.setItem('bySubjectFilters', JSON.stringify(bySubjectFilters))

    setBySubjectDisplayFacetValues([])
    setBySubjectVisualisationData(generateBySubjectData())
  }

  const handleBySubjectFacetItemClick = facetType => {
    const facetIndex = bySubjectFilters.findIndex(f => f.type === facetType)

    setBySubjectFilters(
      bySubjectFilters.map((f, i) => ({
        ...f,
        isFacetSelected: i === facetIndex,
      })),
    )

    setBySubjectDisplayFacetValues(
      bySubjectFullFacetOptions.find(f => f.type === facetType).values,
    )

    setBySubjectSelectedFacetValues(bySubjectFilters[facetIndex].values)
  }

  const handleBySubjectFacetValueClick = valueId => {
    const facet = bySubjectFilters.find(f => f.isFacetSelected)

    if (facet.values.find(s => s.id === valueId)) {
      facet.values = bySubjectSelectedFacetValues.filter(v => v.id !== valueId)
    } else {
      facet.values = [
        ...facet.values,
        bySubjectDisplayFacetValues.find(option => option.id === valueId),
      ]
    }

    setBySubjectFilters(
      bySubjectFilters.map(f =>
        f.type === facet.type ? { ...f, ...{ values: facet.values } } : f,
      ),
    )

    setBySubjectSelectedFacetValues(facet.values)

    const storedFilters = JSON.parse(localStorage.getItem('bySubjectFilters'))
    let shouldShowApplyButton = false

    storedFilters.forEach(storedFacet => {
      const currentFacet = bySubjectFilters.find(
        f => f.type === storedFacet.type,
      )

      if (currentFacet.values.length !== storedFacet.values.length) {
        shouldShowApplyButton = true
      }
    })

    setBySubjectShowApplyFilter(shouldShowApplyButton)
  }

  const handleBySubjectOnClose = () => {
    setBySubjectIsFilterOpen(false)
  }

  const handleBySubjectExpandClick = () => {}

  const handleBySubjectFilterButtonClick = isOpen => {
    if (isOpen) {
      setBySubjectFilters(JSON.parse(localStorage.getItem('bySubjectFilters')))
    }

    setBySubjectIsFilterOpen(isOpen)
  }

  const handleBySubjectSearchChange = rawSearchValue => {
    const searchValue = rawSearchValue.target.value
    const facetType = bySubjectFilters.find(f => f.isFacetSelected).type

    const targetFacet = bySubjectFullFacetOptions.find(
      f => f.type === facetType,
    )

    if (searchValue === '') {
      setBySubjectDisplayFacetValues(targetFacet.values)
    } else {
      setBySubjectDisplayFacetValues(
        targetFacet.values.filter(v =>
          v.value.toLowerCase().includes(searchValue.toLowerCase()),
        ),
      )
    }
  }

  const handleBySubjectDownloadOptionClick = async type => {
    setBySubjectIsDownloadListOpen(false)

    if (type === 'csv') {
      const csvString = await json2csv(
        addKeytoData(bySubjectVisualisationData),
        {
          keys: [
            { field: 'name', title: 'Subject' },
            { field: 'value', title: 'Total Citations' },
          ],
        },
      )

      downloadFile(csvString, 'Citation counts by subject.csv')
    }
  }

  // #endregion bySubjectFilters

  // #region overTimeFilters

  const handleOverTimeFooterTabClick = tabTitle => {
    if (tabTitle === 'download') {
      setOverTimeIsDownloadListOpen(!overTimeIsDownloadListOpen)
    } else {
      setOverTimeSelectedTab(tabTitle)
    }
  }

  const handleOverTimeApplyFilters = () => {
    setOverTimeIsFilterOpen(false)

    localStorage.setItem('overTimeFilters', JSON.stringify(overTimeFilters))

    setOverTimeDisplayFacetValues([])
    setOverTimeVisualisationData(generateOverTimeData())
  }

  const handleOverTimeFacetItemClick = facetType => {
    const facetIndex = overTimeFilters.findIndex(f => f.type === facetType)

    setOverTimeFilters(
      overTimeFilters.map((f, i) => ({
        ...f,
        isFacetSelected: i === facetIndex,
      })),
    )

    setOverTimeDisplayFacetValues(
      overTimeFullFacetOptions.find(f => f.type === facetType).values,
    )

    setOverTimeSelectedFacetValues(overTimeFilters[facetIndex].values)
  }

  const handleOverTimeFacetValueClick = valueId => {
    const facet = overTimeFilters.find(f => f.isFacetSelected)

    if (facet.values.find(s => s.id === valueId)) {
      facet.values = overTimeSelectedFacetValues.filter(v => v.id !== valueId)
    } else {
      facet.values = [
        ...facet.values,
        overTimeDisplayFacetValues.find(option => option.id === valueId),
      ]
    }

    setOverTimeFilters(
      overTimeFilters.map(f =>
        f.type === facet.type ? { ...f, ...{ values: facet.values } } : f,
      ),
    )

    setOverTimeSelectedFacetValues(facet.values)

    const storedFilters = JSON.parse(localStorage.getItem('overTimeFilters'))
    let shouldShowApplyButton = false

    storedFilters.forEach(storedFacet => {
      const currentFacet = overTimeFilters.find(
        f => f.type === storedFacet.type,
      )

      if (currentFacet.values.length !== storedFacet.values.length) {
        shouldShowApplyButton = true
      }
    })

    setOverTimeShowApplyFilter(shouldShowApplyButton)
  }

  const handleOverTimeOnClose = () => {
    setOverTimeIsFilterOpen(false)
  }

  const handleOverTimeExpandClick = () => {}

  const handleOverTimeFilterButtonClick = isOpen => {
    if (isOpen) {
      setOverTimeFilters(JSON.parse(localStorage.getItem('overTimeFilters')))
    }

    setOverTimeIsFilterOpen(isOpen)
  }

  const handleOverTimeSearchChange = rawSearchValue => {
    const searchValue = rawSearchValue.target.value
    const facetType = overTimeFilters.find(f => f.isFacetSelected).type

    const targetFacet = overTimeFullFacetOptions.find(f => f.type === facetType)

    if (searchValue === '') {
      setOverTimeDisplayFacetValues(targetFacet.values)
    } else {
      setOverTimeDisplayFacetValues(
        targetFacet.values.filter(v =>
          v.value.toLowerCase().includes(searchValue.toLowerCase()),
        ),
      )
    }
  }

  const handleOverTimeDownloadOptionClick = async type => {
    setOverTimeIsDownloadListOpen(false)

    if (type === 'csv') {
      const csvString = await json2csv(
        addKeytoData(overTimeVisualisationData),
        {
          keys: [
            { field: 'year', title: 'Year' },
            { field: 'DOI', title: 'DOI' },
            { field: 'Accession ID', title: 'Accession ID' },
            { field: 'total', title: 'Total Citations' },
          ],
        },
      )

      downloadFile(csvString, 'Citation counts over time.csv')
    }
  }

  // #endregion overTimeFilters
  return (
    <Dashboard
      {...args}
      byPublisherData={
        byPublisherSelectedTab === 'chart'
          ? byPublisherVisualisationData
          : addKeytoData(byPublisherVisualisationData)
      }
      byPublisherFilterParams={byPublisherFilters}
      byPublisherFilterValueOptions={byPublisherDisplayFacetValues}
      byPublisherIsDownloadListOpen={byPublisherIsDownloadListOpen}
      byPublisherIsFilterOpen={byPublisherIsFilterOpen}
      byPublisherOnApplyFilters={handleByPublisherApplyFilters}
      byPublisherOnDownloadOptionClick={handleByPublisherDownloadOptionClick}
      byPublisherOnEmptyListLabel={byPublisherEmptyFacetValueListLabel}
      byPublisherOnExpandClick={handleByPublisherExpandClick}
      byPublisherOnFacetItemClick={handleByPublisherFacetItemClick}
      byPublisherOnFacetValueClick={handleByPublisherFacetValueClick}
      byPublisherOnFilterClick={handleByPublisherFilterButtonClick}
      byPublisherOnFilterClose={handleByPublisherOnClose}
      byPublisherOnFilterSearchChange={handleByPublisherSearchChange}
      byPublisherOnFooterTabClick={handleByPublisherFooterTabClick}
      byPublisherSelectedFacetValues={byPublisherSelectedFacetValues}
      byPublisherSelectedFooterTab={byPublisherSelectedTab}
      byPublisherShowFilterFooter={byPublisherShowApplyFilter}
      byPublisherTableColumns={byPublisherTableColumns}
      bySourceData={
        bySourceSelectedTab === 'chart'
          ? bySourceVisualisationData
          : transformChartData(
              bySourceVisualisationData,
              'source',
              'type',
              'value',
            )
      }
      bySourceFilterParams={bySourceFilters}
      bySourceFilterValueOptions={bySourceDisplayFacetValues}
      bySourceIsDownloadListOpen={bySourceIsDownloadListOpen}
      bySourceIsFilterOpen={bySourceIsFilterOpen}
      bySourceOnApplyFilters={handleBySourceApplyFilters}
      bySourceOnDownloadOptionClick={handleBySourceDownloadOptionClick}
      bySourceOnEmptyListLabel={bySourceEmptyFacetValueListLabel}
      bySourceOnExpandClick={handleBySourceExpandClick}
      bySourceOnFacetItemClick={handleBySourceFacetItemClick}
      bySourceOnFacetValueClick={handleBySourceFacetValueClick}
      bySourceOnFilterClick={handleBySourceFilterButtonClick}
      bySourceOnFilterClose={handleBySourceOnClose}
      bySourceOnFilterSearchChange={handleBySourceSearchChange}
      bySourceOnFooterTabClick={handleBySourceFooterTabClick}
      bySourceSelectedFacetValues={bySourceSelectedFacetValues}
      bySourceSelectedFooterTab={bySourceSelectedTab}
      bySourceShowFilterFooter={bySourceShowApplyFilter}
      bySourceTableColumns={bySourceTableColumns}
      bySubjectData={
        bySubjectSelectedTab === 'chart'
          ? bySubjectVisualisationData
          : addKeytoData(bySubjectVisualisationData)
      }
      bySubjectFilterParams={bySubjectFilters}
      bySubjectFilterValueOptions={bySubjectDisplayFacetValues}
      bySubjectIsDownloadListOpen={bySubjectIsDownloadListOpen}
      bySubjectIsFilterOpen={bySubjectIsFilterOpen}
      bySubjectOnApplyFilters={handleBySubjectApplyFilters}
      bySubjectOnDownloadOptionClick={handleBySubjectDownloadOptionClick}
      bySubjectOnEmptyListLabel={bySubjectEmptyFacetValueListLabel}
      bySubjectOnExpandClick={handleBySubjectExpandClick}
      bySubjectOnFacetItemClick={handleBySubjectFacetItemClick}
      bySubjectOnFacetValueClick={handleBySubjectFacetValueClick}
      bySubjectOnFilterClick={handleBySubjectFilterButtonClick}
      bySubjectOnFilterClose={handleBySubjectOnClose}
      bySubjectOnFilterSearchChange={handleBySubjectSearchChange}
      bySubjectOnFooterTabClick={handleBySubjectFooterTabClick}
      bySubjectSelectedFacetValues={bySubjectSelectedFacetValues}
      bySubjectSelectedFooterTab={bySubjectSelectedTab}
      bySubjectShowFilterFooter={bySubjectShowApplyFilter}
      bySubjectTableColumns={bySubjectTableColumns}
      corpusGrowthData={
        corpusGrowthSelectedTab === 'chart'
          ? corpusGrowthData
          : transformChartData(corpusGrowthData, 'month', 'type', 'value')
      }
      corpusGrowthIsDownloadListOpen={corpusGrowthIsDowloadListOpen}
      corpusGrowthOnDownloadOptionClick={handleCorpusGrowthDownloadOptionClick}
      corpusGrowthOnExpandClick={handleCorpusGrowthExpandClick}
      corpusGrowthOnFooterTabClick={handleCorpusGrowthFooterTabClick}
      corpusGrowthSelectedFooterTab={corpusGrowthSelectedTab}
      corpusGrowthTableColumns={corpusGrowthTableColumns}
      overTimeData={
        overTimeSelectedTab === 'chart'
          ? overTimeVisualisationData
          : transformChartData(
              overTimeVisualisationData,
              'year',
              'type',
              'value',
            )
      }
      overTimeFilterParams={overTimeFilters}
      overTimeFilterValueOptions={overTimeDisplayFacetValues}
      overTimeIsDownloadListOpen={overTimeIsDownloadListOpen}
      overTimeIsFilterOpen={overTimeIsFilterOpen}
      overTimeOnApplyFilters={handleOverTimeApplyFilters}
      overTimeOnDownloadOptionClick={handleOverTimeDownloadOptionClick}
      overTimeOnEmptyListLabel={overTimeEmptyFacetValueListLabel}
      overTimeOnExpandClick={handleOverTimeExpandClick}
      overTimeOnFacetItemClick={handleOverTimeFacetItemClick}
      overTimeOnFacetValueClick={handleOverTimeFacetValueClick}
      overTimeOnFilterClick={handleOverTimeFilterButtonClick}
      overTimeOnFilterClose={handleOverTimeOnClose}
      overTimeOnFilterSearchChange={handleOverTimeSearchChange}
      overTimeOnFooterTabClick={handleOverTimeFooterTabClick}
      overTimeSelectedFacetValues={overTimeSelectedFacetValues}
      overTimeSelectedFooterTab={overTimeSelectedTab}
      overTimeShowFilterFooter={overTimeShowApplyFilter}
      overTimeTableColumns={overTimeTableColumns}
      uniqueCountData={transformUniqueCountData(unqiueCountData)}
      uniqueCountIsDownloadListOpen={uniqueCountIsDowloadListOpen}
      uniqueCountOnDownloadOptionClick={handleUniqueCountDownloadOptionClick}
      uniqueCountOnExpandClick={handleUniqueCountExpandClick}
      uniqueCountOnFooterTabClick={handleUniqueCountFooterTabClick}
      uniqueCountSelectedFooterTab={uniqueCountSelectedTab}
      uniqueCountTableColumns={uniqueCountColumns}
    />
  )
}

export const Base = Template.bind({})

// eslint-disable-next-line react/jsx-props-no-spreading

export default {
  component: Dashboard,
  title: 'Dashboard/Dashboard',
}
