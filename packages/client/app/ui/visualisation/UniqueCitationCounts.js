import React from 'react'
import PropTypes from 'prop-types'

import Visualisation from './Visualisation'
import { Table } from '../common'

import CsvSymbol from '../../../static/symbol-csv-file.svg'

const title =
  'Counts of unique repositories, journals, subjects, affiliations, funders'

const downloadOptions = [
  {
    type: 'csv',
    label: 'CSV',
    symbol: CsvSymbol,
  },
]

const UniqueCitationCounts = props => {
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
      visualisationTitle={title}
    >
      {selectedFooterTab === 'table' && (
        <Table columns={tableColumns} data={data} />
      )}
    </Visualisation>
  )
}

UniqueCitationCounts.propTypes = {
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

export default UniqueCitationCounts
