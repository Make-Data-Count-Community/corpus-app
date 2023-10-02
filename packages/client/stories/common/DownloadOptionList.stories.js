import React from 'react'

import { DownloadOptionList } from '../../app/ui'

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

const emptyFunc = () => {}

export const Base = args => (
  <DownloadOptionList
    {...args}
    onOptionClick={emptyFunc}
    options={downloadOptions}
  />
)

export default {
  component: DownloadOptionList,
  title: 'Common/DownloadOptionList',
}
