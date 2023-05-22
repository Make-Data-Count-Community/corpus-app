import React from 'react'

import { ChartFooterButton } from '../../app/ui'

import ChartSymbol from '../../static/symbol-chart.svg'
import ChartSelectedSymbol from '../../static/symbol-chart-selected.svg'
import DownloadSymbol from '../../static/symbol-download.svg'
import DownloadSelectedSymbol from '../../static/symbol-download-selected.svg'
import ListSymbol from '../../static/symbol-list.svg'
import ListSelectedSymbol from '../../static/symbol-list-selected.svg'
import ShareSymbol from '../../static/symbol-share.svg'
import ShareSelectedSymbol from '../../static/symbol-share-selected.svg'

const emptyFunc = () => {}

const isSelected = false

const chartSymbol = ChartSymbol
const chartSelectedSymbol = ChartSelectedSymbol
const downloadSymbol = DownloadSymbol
const downloadSelectedSymbol = DownloadSelectedSymbol
const listSymbol = ListSymbol
const listSelectedSymbol = ListSelectedSymbol
const shareSymbol = ShareSymbol
const shareSelectedSymbol = ShareSelectedSymbol

export const Base = () => (
  <ChartFooterButton
    defaultSymbol={chartSymbol}
    onClick={emptyFunc}
    selected={isSelected}
    selectedSymbol={chartSelectedSymbol}
  >
    Chart
  </ChartFooterButton>
)

export const Download = () => (
  <ChartFooterButton
    defaultSymbol={downloadSymbol}
    onClick={emptyFunc}
    selected={isSelected}
    selectedSymbol={downloadSelectedSymbol}
  >
    Download
  </ChartFooterButton>
)

export const Table = () => (
  <ChartFooterButton
    defaultSymbol={listSymbol}
    onClick={emptyFunc}
    selected={isSelected}
    selectedSymbol={listSelectedSymbol}
  >
    Table
  </ChartFooterButton>
)

export const Share = () => (
  <ChartFooterButton
    defaultSymbol={shareSymbol}
    onClick={emptyFunc}
    selected={isSelected}
    selectedSymbol={shareSelectedSymbol}
  >
    Share
  </ChartFooterButton>
)

export default {
  component: ChartFooterButton,
  title: 'Common/ChartFooterButton',
}
