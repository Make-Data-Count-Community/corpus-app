import React from 'react'

import { DownloadOption } from '../../app/ui'

import CsvSymbol from '../../static/symbol-csv-file.svg'
import PdfSymbol from '../../static/symbol-pdf-file.svg'
import PngSymbol from '../../static/symbol-png-file.svg'
import SvgSymbol from '../../static/symbol-svg-file.svg'

const emptyFunc = () => {}

const csvLabel = 'CSV'
const pdfLabel = 'PDF'
const pngLabel = 'PNG'
const svgLabel = 'SVG'

export const Base = args => (
  <DownloadOption
    {...args}
    label={csvLabel}
    onOptionClick={emptyFunc}
    symbol={CsvSymbol}
    type={csvLabel.toLowerCase()}
  />
)
export const PDF = args => (
  <DownloadOption
    {...args}
    label={pdfLabel}
    onOptionClick={emptyFunc}
    symbol={PdfSymbol}
    type={pdfLabel.toLowerCase()}
  />
)
export const PNG = args => (
  <DownloadOption
    {...args}
    label={pngLabel}
    onOptionClick={emptyFunc}
    symbol={PngSymbol}
    type={pngLabel.toLowerCase()}
  />
)
export const SVG = args => (
  <DownloadOption
    {...args}
    label={svgLabel}
    onOptionClick={emptyFunc}
    symbol={SvgSymbol}
    type={svgLabel.toLowerCase()}
  />
)

export default {
  component: DownloadOption,
  title: 'Common/DownloadOption',
}
