import React from 'react'
import PropTypes from 'prop-types'

import Visualisation from './Visualisation'
import { MultiLineChart, Table } from '../common'

import CsvSymbol from '../../../static/symbol-csv-file.svg'
// import PdfSymbol from '../../../static/symbol-pdf-file.svg'
import PngSymbol from '../../../static/symbol-png-file.svg'
import SvgSymbol from '../../../static/symbol-svg-file.svg'

const title = 'Data citations corpus growth'
const stackField = 'stackField'
const stackItems = ['DOI', 'Accession Number']
const xField = 'xField'
const yField = 'yField'
const stackFieldTooltipTitle = 'Value'
const yFieldTooltipTitle = 'Citations'

const downloadOptions = [
  {
    type: 'png',
    label: 'PNG',
    symbol: PngSymbol,
  },
  //   {
  //     type: 'pdf',
  //     label: 'PDF',
  //     symbol: PdfSymbol,
  //   },
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

const expandPath = '/visualisation/citation-corpus-growth'

const CitationCorpusGrowth = props => {
  const {
    data,
    isDownloadListOpen,
    loading,
    onDownloadOptionClick,
    onFooterTabClick,
    onNewView,
    selectedFooterTab,
    showExpandButton,
    tableColumns,
  } = props

  return (
    <Visualisation
      downloadOptions={downloadOptions}
      expandPath={expandPath}
      isDownloadListOpen={isDownloadListOpen}
      loading={loading}
      onDownloadOptionClick={onDownloadOptionClick}
      onFooterTabClick={onFooterTabClick}
      selectedFooterTab={selectedFooterTab}
      showExpandButton={showExpandButton}
      showFooterChartTab
      visualisationTitle={title}
    >
      {selectedFooterTab === 'chart' && (
        <MultiLineChart
          data={data}
          onNewView={onNewView}
          stackField={stackField}
          stackFieldTooltipTitle={stackFieldTooltipTitle}
          stackItems={stackItems}
          xField={xField}
          yField={yField}
          yFieldTooltipTitle={yFieldTooltipTitle}
        />
      )}
      {selectedFooterTab === 'table' && (
        <Table columns={tableColumns} data={data} />
      )}
    </Visualisation>
  )
}

CitationCorpusGrowth.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  isDownloadListOpen: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  onDownloadOptionClick: PropTypes.func.isRequired,
  onFooterTabClick: PropTypes.func.isRequired,
  onNewView: PropTypes.func.isRequired,
  selectedFooterTab: PropTypes.string.isRequired,
  showExpandButton: PropTypes.bool,
  tableColumns: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      dataIndex: PropTypes.string,
      key: PropTypes.string,
    }),
  ).isRequired,
}

CitationCorpusGrowth.defaultProps = {
  showExpandButton: false,
}

export default CitationCorpusGrowth
