import React, { useState } from 'react'

import { UniqueCitationCounts } from '../../app/ui'

const randomNumber = ceiling => {
  return Math.floor(Math.random() * ceiling)
}

const data = [
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

const columns = [
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

const transformData = sourceData => {
  return sourceData.map(s => {
    const total = s.pidMetadata + s.thirdPartyAggr
    return { ...s, key: s.facet, total }
  })
}

const defaultTab = 'table'

const Template = args => {
  const [selectedTab, setSelectedTab] = useState(defaultTab)
  const [isDowloadListOpen, setIsDownloadListOpen] = useState(false)

  const handleFooterTabClick = tabTitle => {
    if (tabTitle === 'download') {
      setIsDownloadListOpen(!isDowloadListOpen)
    } else {
      setSelectedTab(tabTitle)
    }
  }

  const handleExpandClick = () => {}

  const handleDownloadOptionClick = () => {}

  return (
    <UniqueCitationCounts
      {...args}
      data={transformData(data)}
      isDownloadListOpen={isDowloadListOpen}
      onDownloadOptionClick={handleDownloadOptionClick}
      onExpandClick={handleExpandClick}
      onFooterTabClick={handleFooterTabClick}
      selectedFooterTab={selectedTab}
      tableColumns={columns}
    />
  )
}

export const Base = Template.bind({})

export default {
  component: UniqueCitationCounts,
  title: 'Visualisation/UniqueCitationCounts',
}
