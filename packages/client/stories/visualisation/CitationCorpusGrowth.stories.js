import React, { useRef, useState } from 'react'

import { CitationCorpusGrowth } from '../../app/ui'

const randomNumber = ceiling => {
  return Math.floor(Math.random() * ceiling)
}

const data = [
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

const columns = [
  {
    title: 'Month',
    dataIndex: 'xField',
    key: 'xField',
  },
  {
    title: 'DOI',
    dataIndex: 'DOI',
    key: 'doi',
    render: value => value?.toLocaleString('en-US') || 0,
  },
  {
    title: 'Accession Number',
    dataIndex: 'Accession Number',
    key: 'accession',
    render: value => value?.toLocaleString('en-US') || 0,
  },
  {
    title: 'Total',
    dataIndex: 'total',
    key: 'total',
    render: value => value?.toLocaleString('en-US') || 0,
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
          : transformData(data, 'xField', 'stackField', 'yField')
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
