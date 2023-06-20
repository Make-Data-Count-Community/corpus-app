import React, { useState } from 'react'
// import { useQuery } from '@apollo/client'
import { json2csv } from 'json-2-csv'
// import { cloneDeep } from 'lodash'

import { UniqueCitationCounts, VisuallyHiddenElement } from '../ui'

// import { GET_UNIQUE_COUNT } from '../graphql'

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

const transformUniqueCountData = sourceData => {
  return sourceData.map(s => {
    const total = s.pidMetadata + s.thirdPartyAggr
    return { ...s, key: s.facet, total }
  })
}

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
    render: value => value?.toLocaleString('en-US') || 0,
  },
  {
    title: 'PID Metadata',
    dataIndex: 'pidMetadata',
    key: 'pidMetadata',
    render: value => value?.toLocaleString('en-US') || 0,
  },
  {
    title: 'Total',
    dataIndex: 'total',
    key: 'total',
    render: value => value?.toLocaleString('en-US') || 0,
  },
]

const uniqueCountDefaultTab = 'table'

const UniqueCitationCountsPage = () => {
  const [uniqueCountSelectedTab, setUniqueCountSelectedTab] = useState(
    uniqueCountDefaultTab,
  )

  const [uniqueCountIsDowloadListOpen, setUniqueCountIsDownloadListOpen] =
    useState(false)

  const uniqueCountData = []
  const uniqueCountLoading = false

  //   const { data: uniqueCountData, loading: uniqueCountLoading } =
  //     useQuery(GET_UNIQUE_COUNT)

  const handleUniqueCountFooterTabClick = tabTitle => {
    if (tabTitle === 'download') {
      setUniqueCountIsDownloadListOpen(!uniqueCountIsDowloadListOpen)
    } else {
      setUniqueCountSelectedTab(tabTitle)
    }
  }

  const handleUniqueCountDownloadOptionClick = async type => {
    setUniqueCountIsDownloadListOpen(false)

    if (type === 'csv') {
      const csvString = await json2csv(
        transformUniqueCountData(uniqueCountData),
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

  return (
    <>
      <VisuallyHiddenElement as="h1">
        Counts of unique repositories, journals, subjects, affiliations, funders
        page
      </VisuallyHiddenElement>
      <UniqueCitationCounts
        data={transformUniqueCountData(uniqueCountData)}
        isDownloadListOpen={uniqueCountIsDowloadListOpen}
        loading={uniqueCountLoading}
        onDownloadOptionClick={handleUniqueCountDownloadOptionClick}
        onFooterTabClick={handleUniqueCountFooterTabClick}
        selectedFooterTab={uniqueCountSelectedTab}
        showExpandButton
        tableColumns={uniqueCountColumns}
      />
      <VisuallyHiddenElement
        aria-live="polite"
        as="div"
        id="search-results-update"
        role="status"
      />
    </>
  )
}

export default UniqueCitationCountsPage
