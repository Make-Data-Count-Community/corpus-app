import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { grid } from '@coko/client'
import { Popover as AntPopover } from 'antd'

import ChartFooterButton from './ChartFooterButton'
import DownloadOptionList from './DownloadOptionList'

import ChartSymbol from '../../../static/symbol-chart.svg'
import ChartSelectedSymbol from '../../../static/symbol-chart-selected.svg'
import DownloadSymbol from '../../../static/symbol-download.svg'
import DownloadSelectedSymbol from '../../../static/symbol-download-selected.svg'
import ListSymbol from '../../../static/symbol-list.svg'
import ListSelectedSymbol from '../../../static/symbol-list-selected.svg'
import ShareSymbol from '../../../static/symbol-share.svg'
import ShareSelectedSymbol from '../../../static/symbol-share-selected.svg'

const ChartFooterWrapper = styled.div`
  display: flex;
  /* flex-grow: 1; */
  padding: ${grid(0)};
  width: 100%;
`

const ChartFooter = props => {
  const {
    downloadOptions,
    isDowloadListOpen,
    onDownloadOptionClick,
    onTabClick,
    selectedTab,
    showChartTab,
  } = props

  return (
    <ChartFooterWrapper>
      {showChartTab && (
        <ChartFooterButton
          defaultSymbol={ChartSymbol}
          onClick={() => onTabClick('chart')}
          selected={selectedTab === 'chart'}
          selectedSymbol={ChartSelectedSymbol}
        >
          Chart
        </ChartFooterButton>
      )}

      <ChartFooterButton
        defaultSymbol={ListSymbol}
        onClick={() => onTabClick('table')}
        selected={selectedTab === 'table'}
        selectedSymbol={ListSelectedSymbol}
      >
        Table
      </ChartFooterButton>
      <AntPopover
        content={
          <DownloadOptionList
            onOptionClick={onDownloadOptionClick}
            options={downloadOptions}
          />
        }
        onOpenChange={() => onTabClick('download')}
        open={isDowloadListOpen}
        placement="top"
        trigger="click"
      >
        <ChartFooterButton
          defaultSymbol={DownloadSymbol}
          selected={selectedTab === 'download'}
          selectedSymbol={DownloadSelectedSymbol}
        >
          Download
        </ChartFooterButton>
      </AntPopover>

      <ChartFooterButton
        defaultSymbol={ShareSymbol}
        onClick={() => onTabClick('share')}
        selected={selectedTab === 'share'}
        selectedSymbol={ShareSelectedSymbol}
      >
        Share
      </ChartFooterButton>
    </ChartFooterWrapper>
  )
}

ChartFooter.propTypes = {
  downloadOptions: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      symbol: PropTypes.string.isRequired,
    }),
  ).isRequired,
  isDowloadListOpen: PropTypes.bool,
  onDownloadOptionClick: PropTypes.func.isRequired,
  onTabClick: PropTypes.func.isRequired,
  selectedTab: PropTypes.string.isRequired,
  showChartTab: PropTypes.bool,
}

ChartFooter.defaultProps = {
  isDowloadListOpen: false,
  showChartTab: false,
}

export default ChartFooter
