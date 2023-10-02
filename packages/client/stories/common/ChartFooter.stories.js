import React, { useState } from 'react'

import { ChartFooter } from '../../app/ui'

import CsvSymbol from '../../static/symbol-csv-file.svg'
import PdfSymbol from '../../static/symbol-pdf-file.svg'
import PngSymbol from '../../static/symbol-png-file.svg'
import SvgSymbol from '../../static/symbol-svg-file.svg'

const downloadOptions = [
  {
    type: 'png',
    label: 'PNG',
    symbol: PngSymbol,
  },
  {
    type: 'pdf',
    label: 'PDF',
    symbol: PdfSymbol,
  },
  {
    type: 'svg',
    label: 'SVG',
    symbol: SvgSymbol,
  },
  {
    type: 'csv',
    label: 'CSV',
    symbol: CsvSymbol,
  },
]

const Template = args => {
  const [selectedTab, setSelectedTab] = useState('')
  const [isDowloadListOpen, setIsDownloadListOpen] = useState(false)

  const handleTabClick = tabTitle => {
    if (tabTitle === 'download') {
      setIsDownloadListOpen(!isDowloadListOpen)
    } else {
      setSelectedTab(tabTitle)
    }
  }

  const handleDownloadOptionClick = () => {}

  return (
    <ChartFooter
      {...args}
      downloadOptions={downloadOptions}
      isDowloadListOpen={isDowloadListOpen}
      onDownloadOptionClick={handleDownloadOptionClick}
      onTabClick={handleTabClick}
      selectedTab={selectedTab}
    />
  )
}

export const Base = Template.bind({})

export default {
  component: ChartFooter,
  title: 'Common/ChartFooter',
}
