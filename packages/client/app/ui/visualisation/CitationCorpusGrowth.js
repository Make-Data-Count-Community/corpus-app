import React from 'react'
import PropTypes from 'prop-types'

import Visualisation from './Visualisation'
import { MultiLineChart, Table } from '../common'

import CsvSymbol from '../../../static/symbol-csv-file.svg'
// import PdfSymbol from '../../../static/symbol-pdf-file.svg'
// import PngSymbol from '../../../static/symbol-png-file.svg'
// import SvgSymbol from '../../../static/symbol-svg-file.svg'

const title = 'Data citations corpus growth'
const stackField = 'type'
const stackItems = ['DOI', 'Accession ID']
const xField = 'month'
const yField = 'value'

const downloadOptions = [
  //   {
  //     type: 'png',
  //     label: 'PNG',
  //     symbol: PngSymbol,
  //   },
  //   {
  //     type: 'pdf',
  //     label: 'PDF',
  //     symbol: PdfSymbol,
  //   },
  //   {
  //     type: 'svg',
  //     label: 'SVG',
  //     symbol: SvgSymbol,
  //   },
  {
    type: 'csv',
    label: 'CSV',
    symbol: CsvSymbol,
  },
]

const CitationCorpusGrowth = props => {
  const {
    data,
    isDownloadListOpen,
    onDownloadOptionClick,
    onExpandClick,
    onFooterTabClick,
    selectedFooterTab,
    tableColumns,
  } = props

  return (
    <Visualisation
      downloadOptions={downloadOptions}
      isDownloadListOpen={isDownloadListOpen}
      onDownloadOptionClick={onDownloadOptionClick}
      onExpandClick={onExpandClick}
      onFooterTabClick={onFooterTabClick}
      selectedFooterTab={selectedFooterTab}
      //   showFooterChartTab
      visualisationTitle={title}
    >
      {selectedFooterTab === 'chart' && (
        <MultiLineChart
          data={data}
          stackField={stackField}
          stackItems={stackItems}
          xField={xField}
          yField={yField}
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
  onDownloadOptionClick: PropTypes.func.isRequired,
  onExpandClick: PropTypes.func.isRequired,
  onFooterTabClick: PropTypes.func.isRequired,
  selectedFooterTab: PropTypes.string.isRequired,
  tableColumns: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      dataIndex: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
    }),
  ).isRequired,
}

export default CitationCorpusGrowth
