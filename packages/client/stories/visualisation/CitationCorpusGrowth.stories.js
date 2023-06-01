import React, { useRef, useState } from 'react'

import { CitationCorpusGrowth } from '../../app/ui'

const randomNumber = ceiling => {
  return Math.floor(Math.random() * ceiling)
}

const data = [
  { month: '01/2023', value: randomNumber(100000), type: 'DOI' },
  { month: '02/2023', value: randomNumber(1000000), type: 'DOI' },
  { month: '03/2023', value: randomNumber(10000000), type: 'DOI' },
  { month: '04/2023', value: randomNumber(50000000), type: 'DOI' },
  { month: '01/2023', value: randomNumber(100000), type: 'Accession ID' },
  { month: '02/2023', value: randomNumber(1000000), type: 'Accession ID' },
  { month: '03/2023', value: randomNumber(10000000), type: 'Accession ID' },
  { month: '04/2023', value: randomNumber(50000000), type: 'Accession ID' },
]

const columns = [
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

const groupBy = (xs, key) => {
  return xs.reduce((rv, x) => {
    // eslint-disable-next-line no-param-reassign
    ;(rv[x[key]] = rv[x[key]] || []).push(x)
    return rv
  }, {})
}

const transformData = (sourceData, transformBy, keyField, valueField) => {
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

const defaultTab = 'table'

const Template = args => {
  const [selectedTab, setSelectedTab] = useState(defaultTab)
  const [isDowloadListOpen, setIsDownloadListOpen] = useState(false)
  const newView = useRef(null)

  const handleFooterTabClick = tabTitle => {
    if (tabTitle === 'download') {
      setIsDownloadListOpen(!isDowloadListOpen)
    } else {
      setSelectedTab(tabTitle)
    }
  }

  const handleExpandClick = () => {}

  const handleDownloadOptionClick = () => {}

  const handleNewView = view => {
    newView.current = view
  }

  return (
    <CitationCorpusGrowth
      {...args}
      data={
        selectedTab === 'chart'
          ? data
          : transformData(data, 'month', 'type', 'value')
      }
      isDownloadListOpen={isDowloadListOpen}
      onDownloadOptionClick={handleDownloadOptionClick}
      onExpandClick={handleExpandClick}
      onFooterTabClick={handleFooterTabClick}
      onNewView={handleNewView}
      selectedFooterTab={selectedTab}
      tableColumns={columns}
    />
  )
}

export const Base = Template.bind({})

export default {
  component: CitationCorpusGrowth,
  title: 'Visualisation/CitationCorpusGrowth',
}
