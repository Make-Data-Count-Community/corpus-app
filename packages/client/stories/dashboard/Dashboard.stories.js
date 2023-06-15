import React, { useEffect, useRef, useState } from 'react'
import { lorem } from 'faker'
import { uuid } from '@coko/client'
import { json2csv } from 'json-2-csv'

import { Dashboard } from '../../app/ui'

const facetNotSelectedLabel = 'Please select a facet'
const displayListEmptyLabel = 'No matches found'

const downloadFile = (inputData, fileName, type = 'csv') => {
  const url =
    type === 'csv'
      ? window.URL.createObjectURL(new Blob([inputData]))
      : inputData

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
  { xField: '01/2023', yField: randomNumber(100000), stackField: 'DOI' },
  { xField: '02/2023', yField: randomNumber(1000000), stackField: 'DOI' },
  { xField: '03/2023', yField: randomNumber(10000000), stackField: 'DOI' },
  { xField: '04/2023', yField: randomNumber(50000000), stackField: 'DOI' },
  {
    xField: '01/2023',
    yField: randomNumber(100000),
    stackField: 'Accession Number',
  },
  {
    xField: '02/2023',
    yField: randomNumber(1000000),
    stackField: 'Accession Number',
  },
  {
    xField: '03/2023',
    yField: randomNumber(10000000),
    stackField: 'Accession Number',
  },
  {
    xField: '04/2023',
    yField: randomNumber(50000000),
    stackField: 'Accession Number',
  },
]

const corpusGrowthTableColumns = [
  {
    title: 'Month',
    dataIndex: 'xField',
    key: 'xField',
  },
  {
    title: 'DOI',
    dataIndex: 'DOI',
    key: 'doi',
    render: value =>
      value?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || 0,
  },
  {
    title: 'Accession Number',
    dataIndex: 'Accession Number',
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
  { xField: 2010, yField: randomNumber(10000000), stackField: 'DOI' },
  { xField: 2011, yField: randomNumber(10000000), stackField: 'DOI' },
  { xField: 2012, yField: randomNumber(10000000), stackField: 'DOI' },
  { xField: 2013, yField: randomNumber(10000000), stackField: 'DOI' },
  { xField: 2014, yField: randomNumber(10000000), stackField: 'DOI' },
  { xField: 2015, yField: randomNumber(10000000), stackField: 'DOI' },
  { xField: 2016, yField: randomNumber(10000000), stackField: 'DOI' },
  { xField: 2017, yField: randomNumber(10000000), stackField: 'DOI' },
  { xField: 2018, yField: randomNumber(10000000), stackField: 'DOI' },
  { xField: 2019, yField: randomNumber(10000000), stackField: 'DOI' },
  {
    xField: 2010,
    yField: randomNumber(10000000),
    stackField: 'Accession Number',
  },
  {
    xField: 2011,
    yField: randomNumber(10000000),
    stackField: 'Accession Number',
  },
  {
    xField: 2012,
    yField: randomNumber(10000000),
    stackField: 'Accession Number',
  },
  {
    xField: 2013,
    yField: randomNumber(10000000),
    stackField: 'Accession Number',
  },
  {
    xField: 2014,
    yField: randomNumber(10000000),
    stackField: 'Accession Number',
  },
  {
    xField: 2015,
    yField: randomNumber(10000000),
    stackField: 'Accession Number',
  },
  {
    xField: 2016,
    yField: randomNumber(10000000),
    stackField: 'Accession Number',
  },
  {
    xField: 2017,
    yField: randomNumber(10000000),
    stackField: 'Accession Number',
  },
  {
    xField: 2018,
    yField: randomNumber(10000000),
    stackField: 'Accession Number',
  },
  {
    xField: 2019,
    yField: randomNumber(10000000),
    stackField: 'Accession Number',
  },
]

const overTimeData = generateOverTimeData()

const overTimeTableColumns = [
  {
    title: 'Year',
    dataIndex: 'xField',
    key: 'xField',
  },
  {
    title: 'DOI',
    dataIndex: 'DOI',
    key: 'doi',
    render: value =>
      value?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || 0,
  },
  {
    title: 'Accession Number',
    dataIndex: 'Accession Number',
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
  { id: bySubjectParentId, xField: '', yField: 0, parent: null },
  {
    id: uuid(),
    xField: 'Subject 0',
    yField: randomNumber(1000000),
    parent: bySubjectParentId,
  },
  {
    id: uuid(),
    xField: 'Subject 1',
    yField: randomNumber(1000000),
    parent: bySubjectParentId,
  },
  {
    id: uuid(),
    xField: 'Subject 2',
    yField: randomNumber(1000000),
    parent: bySubjectParentId,
  },
  {
    id: uuid(),
    xField: 'Subject 3',
    yField: randomNumber(1000000),
    parent: bySubjectParentId,
  },
  {
    id: uuid(),
    xField: 'Subject 4',
    yField: randomNumber(1000000),
    parent: bySubjectParentId,
  },
  {
    id: uuid(),
    xField: 'Subject 5',
    yField: randomNumber(1000000),
    parent: bySubjectParentId,
  },
  {
    id: uuid(),
    xField: 'Subject 6',
    yField: randomNumber(1000000),
    parent: bySubjectParentId,
  },
  {
    id: uuid(),
    xField: 'Subject 7',
    yField: randomNumber(1000000),
    parent: bySubjectParentId,
  },
  {
    id: uuid(),
    xField: 'Subject 8',
    yField: randomNumber(1000000),
    parent: bySubjectParentId,
  },
  {
    id: uuid(),
    xField: 'Subject 9',
    yField: randomNumber(1000000),
    parent: bySubjectParentId,
  },
  {
    id: uuid(),
    xField: 'Subject 10',
    yField: randomNumber(1000000),
    parent: bySubjectParentId,
  },
  {
    id: uuid(),
    xField: 'Subject 11',
    yField: randomNumber(1000000),
    parent: bySubjectParentId,
  },
  {
    id: uuid(),
    xField: 'Subject 12',
    yField: randomNumber(1000000),
    parent: bySubjectParentId,
  },
  {
    id: uuid(),
    xField: 'Subject 13',
    yField: randomNumber(1000000),
    parent: bySubjectParentId,
  },
  {
    id: uuid(),
    xField: 'Subject 14',
    yField: randomNumber(1000000),
    parent: bySubjectParentId,
  },
  {
    id: uuid(),
    xField: 'Subject 15',
    yField: randomNumber(1000000),
    parent: bySubjectParentId,
  },
  {
    id: uuid(),
    xField: 'Subject 16',
    yField: randomNumber(1000000),
    parent: bySubjectParentId,
  },
  {
    id: uuid(),
    xField: 'Subject 17',
    yField: randomNumber(1000000),
    parent: bySubjectParentId,
  },
  {
    id: uuid(),
    xField: 'Subject 18',
    yField: randomNumber(1000000),
    parent: bySubjectParentId,
  },
  {
    id: uuid(),
    xField: 'Subject 19',
    yField: randomNumber(1000000),
    parent: bySubjectParentId,
  },
]

const bySubjectData = generateBySubjectData()

const bySubjectTableColumns = [
  {
    title: 'Subject',
    dataIndex: 'xField',
    key: 'xField',
  },
  {
    title: 'Total Citations',
    dataIndex: 'yField',
    key: 'yField',
    render: value =>
      value?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || 0,
  },
]

const bySubjectFilterParams = [
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
  { id: uuid(), xField: 'Publisher 1', yField: randomNumber(1000000) },
  { id: uuid(), xField: 'Publisher 2', yField: randomNumber(1000000) },
  { id: uuid(), xField: 'Publisher 3', yField: randomNumber(1000000) },
  { id: uuid(), xField: 'Publisher 4', yField: randomNumber(1000000) },
  { id: uuid(), xField: 'Publisher 5', yField: randomNumber(1000000) },
  { id: uuid(), xField: 'Publisher 6', yField: randomNumber(1000000) },
  { id: uuid(), xField: 'Publisher 7', yField: randomNumber(1000000) },
  { id: uuid(), xField: 'Publisher 8', yField: randomNumber(1000000) },
  { id: uuid(), xField: 'Publisher 9', yField: randomNumber(1000000) },
  { id: uuid(), xField: 'Publisher 10', yField: randomNumber(1000000) },
]

const byPublisherData = generateByPublisherData()

const byPublisherTableColumns = [
  {
    title: 'Publisher',
    dataIndex: 'xField',
    key: 'xField',
  },
  {
    title: 'Total Citations',
    dataIndex: 'yField',
    key: 'yField',
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
    { xField: 'CZI', yField: randomNumber(10000000), stackField: 'DOI' },
    {
      xField: 'DataCite Event Data',
      yField: randomNumber(10000000),
      stackField: 'DOI',
    },
    { xField: 'OpenAIRE', yField: randomNumber(10000000), stackField: 'DOI' },
    {
      xField: 'CZI',
      yField: randomNumber(10000000),
      stackField: 'Accession Number',
    },
    {
      xField: 'DataCite Event Data',
      yField: 0,
      stackField: 'Accession Number',
    },
    {
      xField: 'OpenAIRE',
      yField: randomNumber(10000000),
      stackField: 'Accession Number',
    },
  ]
}

const bySourceData = generateBySourceData()

const bySourceTableColumns = [
  {
    title: 'Source',
    dataIndex: 'xField',
    key: 'xField',
  },
  {
    title: 'DOI',
    dataIndex: 'DOI',
    key: 'doi',
    render: value =>
      value?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || 0,
  },
  {
    title: 'Accession Number',
    dataIndex: 'Accession Number',
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

  const corpusGrowthNewView = useRef(null)

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

  const bySourceNewView = useRef(null)

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

  const bySubjectNewView = useRef(null)

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

  const [overTimeLoading, setOverTimeLoading] = useState(true)

  const [overTimeIsFilterOpen, setOverTimeIsFilterOpen] = useState(false)

  const [overTimeIsDownloadListOpen, setOverTimeIsDownloadListOpen] =
    useState(false)

  const [
    overTimeEmptyFacetValueListLabel,
    setOverTimeEmptyFacetValueListLabel,
  ] = useState(facetNotSelectedLabel)

  const overTimeNewView = useRef(null)

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

  const byPublisherNewView = useRef(null)

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

    setTimeout(() => {
      setOverTimeLoading(false)
    }, randomNumber(5000))

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
        transformChartData(corpusGrowthData, 'xField', 'stackField', 'yField'),
        {
          keys: [
            { field: 'xField', title: 'Month' },
            { field: 'DOI', title: 'DOI' },
            { field: 'Accession Number', title: 'Accession Number' },
            { field: 'total', title: 'Total' },
          ],
        },
      )

      downloadFile(csvString, 'Data citations corpus growth.csv')
    } else if (type === 'png' || type === 'svg') {
      const imgString = await corpusGrowthNewView.current.toImageURL(
        type,
        type === 'png' ? 4 : 2,
      )

      downloadFile(imgString, `Data citations corpus growth.${type}`, type)
    }
  }

  const handleCorpusGrowthNewView = view => {
    corpusGrowthNewView.current = view
  }

  const handleUniqueCountFooterTabClick = tabTitle => {
    if (tabTitle === 'download') {
      setUniqueCountIsDownloadListOpen(!uniqueCountIsDowloadListOpen)
    } else {
      setUniqueCountSelectedTab(tabTitle)
    }
  }

  const handleUniqueCountExpandClick = () => {}

  const handleUniqueCountDownloadOptionClick = async type => {
    setUniqueCountIsDownloadListOpen(false)

    if (type === 'csv') {
      const csvString = await json2csv(
        transformUniqueCountData(unqiueCountData),
        {
          keys: [
            { field: 'facet', title: 'Facet' },
            { field: 'thirdPartyAggr', title: 'Third party aggregator' },
            { field: 'pidMetadata', title: 'PID Metadata' },
            { field: 'total', title: 'Total' },
          ],
        },
      )

      downloadFile(
        csvString,
        'Counts of unique repositories, journals, subjects, affiliations, funders.csv',
      )
    }
  }

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
          'xField',
          'stackField',
          'yField',
        ),
        {
          keys: [
            { field: 'xField', title: 'Source' },
            { field: 'DOI', title: 'DOI' },
            { field: 'Accession Number', title: 'Accession Number' },
            { field: 'total', title: 'Total Citations' },
          ],
        },
      )

      downloadFile(csvString, 'Citation counts by source of citation.csv')
    } else if (type === 'png' || type === 'svg') {
      const imgString = await bySourceNewView.current.toImageURL(
        type,
        type === 'png' ? 4 : 2,
      )

      downloadFile(
        imgString,
        `Citation counts by source of citation.${type}`,
        type,
      )
    }
  }

  const handleBySourceNewView = view => {
    bySourceNewView.current = view
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
            { field: 'xField', title: 'Publisher' },
            { field: 'yField', title: 'Total Citations' },
          ],
        },
      )

      downloadFile(csvString, 'Citation counts by publisher.csv')
    } else if (type === 'png' || type === 'svg') {
      const imgString = await byPublisherNewView.current.toImageURL(
        type,
        type === 'png' ? 4 : 2,
      )

      downloadFile(imgString, `Citation counts by publisher.${type}`, type)
    }
  }

  const handleByPublisherNewView = view => {
    byPublisherNewView.current = view
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
            { field: 'xField', title: 'Subject' },
            { field: 'yField', title: 'Total Citations' },
          ],
        },
      )

      downloadFile(csvString, 'Citation counts by subject.csv')
    } else if (type === 'png' || type === 'svg') {
      const imgString = await bySubjectNewView.current.toImageURL(
        type,
        type === 'png' ? 4 : 2,
      )

      downloadFile(imgString, `Citation counts by subject.${type}`, type)
    }
  }

  const handleBySubjectNewView = view => {
    bySubjectNewView.current = view
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
        addKeytoData(
          transformChartData(
            overTimeVisualisationData,
            'xField',
            'stackField',
            'yField',
          ),
        ),
        {
          keys: [
            { field: 'xField', title: 'Year' },
            { field: 'DOI', title: 'DOI' },
            { field: 'Accession Number', title: 'Accession Number' },
            { field: 'total', title: 'Total Citations' },
          ],
        },
      )

      downloadFile(csvString, 'Citation counts over time.csv')
    } else if (type === 'png' || type === 'svg') {
      const imgString = await overTimeNewView.current.toImageURL(
        type,
        type === 'png' ? 4 : 2,
      )

      downloadFile(imgString, `Citation counts over time.${type}`, type)
    }
  }

  const handlOverTimeOnNewView = view => {
    overTimeNewView.current = view
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
      byPublisherOnNewView={handleByPublisherNewView}
      byPublisherSelectedFacetValues={byPublisherSelectedFacetValues}
      byPublisherSelectedFooterTab={byPublisherSelectedTab}
      byPublisherShowExpandButton
      byPublisherShowFilterFooter={byPublisherShowApplyFilter}
      byPublisherTableColumns={byPublisherTableColumns}
      bySourceData={
        bySourceSelectedTab === 'chart'
          ? bySourceVisualisationData
          : transformChartData(
              bySourceVisualisationData,
              'xField',
              'stackField',
              'yField',
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
      bySourceOnNewView={handleBySourceNewView}
      bySourceSelectedFacetValues={bySourceSelectedFacetValues}
      bySourceSelectedFooterTab={bySourceSelectedTab}
      bySourceShowExpandButton
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
      bySubjectOnNewView={handleBySubjectNewView}
      bySubjectSelectedFacetValues={bySubjectSelectedFacetValues}
      bySubjectSelectedFooterTab={bySubjectSelectedTab}
      bySubjectShowExpandButton
      bySubjectShowFilterFooter={bySubjectShowApplyFilter}
      bySubjectTableColumns={bySubjectTableColumns}
      corpusGrowthData={
        corpusGrowthSelectedTab === 'chart'
          ? corpusGrowthData
          : transformChartData(
              corpusGrowthData,
              'xField',
              'stackField',
              'yField',
            )
      }
      corpusGrowthIsDownloadListOpen={corpusGrowthIsDowloadListOpen}
      corpusGrowthOnDownloadOptionClick={handleCorpusGrowthDownloadOptionClick}
      corpusGrowthOnExpandClick={handleCorpusGrowthExpandClick}
      corpusGrowthOnFooterTabClick={handleCorpusGrowthFooterTabClick}
      corpusGrowthOnNewView={handleCorpusGrowthNewView}
      corpusGrowthSelectedFooterTab={corpusGrowthSelectedTab}
      corpusGrowthShowExpandButton
      corpusGrowthTableColumns={corpusGrowthTableColumns}
      overTimeData={
        overTimeSelectedTab === 'chart'
          ? overTimeVisualisationData
          : transformChartData(
              overTimeVisualisationData,
              'xField',
              'stackField',
              'yField',
            )
      }
      overTimeFilterParams={overTimeFilters}
      overTimeFilterValueOptions={overTimeDisplayFacetValues}
      overTimeIsDownloadListOpen={overTimeIsDownloadListOpen}
      overTimeIsFilterOpen={overTimeIsFilterOpen}
      overTimeLoading={overTimeLoading}
      overTimeOnApplyFilters={handleOverTimeApplyFilters}
      overTimeOnDownloadOptionClick={handleOverTimeDownloadOptionClick}
      overTimeOnEmptyListLabel={overTimeEmptyFacetValueListLabel}
      overTimeOnFacetItemClick={handleOverTimeFacetItemClick}
      overTimeOnFacetValueClick={handleOverTimeFacetValueClick}
      overTimeOnFilterClick={handleOverTimeFilterButtonClick}
      overTimeOnFilterClose={handleOverTimeOnClose}
      overTimeOnFilterSearchChange={handleOverTimeSearchChange}
      overTimeOnFooterTabClick={handleOverTimeFooterTabClick}
      overTimeOnNewView={handlOverTimeOnNewView}
      overTimeSelectedFacetValues={overTimeSelectedFacetValues}
      overTimeSelectedFooterTab={overTimeSelectedTab}
      overTimeShowExpandButton
      overTimeShowFilterFooter={overTimeShowApplyFilter}
      overTimeTableColumns={overTimeTableColumns}
      uniqueCountData={transformUniqueCountData(unqiueCountData)}
      uniqueCountIsDownloadListOpen={uniqueCountIsDowloadListOpen}
      uniqueCountOnDownloadOptionClick={handleUniqueCountDownloadOptionClick}
      uniqueCountOnExpandClick={handleUniqueCountExpandClick}
      uniqueCountOnFooterTabClick={handleUniqueCountFooterTabClick}
      uniqueCountSelectedFooterTab={uniqueCountSelectedTab}
      uniqueCountShowExpandButton
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
