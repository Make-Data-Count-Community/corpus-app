import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import Visualisation from './Visualisation'
import { Table } from '../common'

import CsvSymbol from '../../../static/symbol-csv-file.svg'
import PdfSymbol from '../../../static/symbol-pdf-file.svg'

const Wrapper = styled.div``

const title =
  'Counts of unique repositories, journals, subjects, affiliations, funders'

const downloadOptions = [
  {
    type: 'pdf',
    label: 'PDF',
    symbol: PdfSymbol,
  },
  {
    type: 'csv',
    label: 'CSV',
    symbol: CsvSymbol,
  },
]

const UniqueCitationCounts = props => {
  const {
    data,
    filterParams,
    filterValueOptions,
    isDownloadListOpen,
    isFilterOpen,
    onApplyFilters,
    onDownloadOptionClick,
    onEmptyListLabel,
    onExpandClick,
    onFacetItemClick,
    onFacetValueClick,
    onFilterClick,
    onFilterClose,
    onFilterSearchChange,
    onFooterTabClick,
    selectedFooterTab,
    selectedFacetValues,
    showFilterFooter,
    tableColumns,
  } = props

  return (
    <Wrapper>
      <Visualisation
        downloadOptions={downloadOptions}
        filterParams={filterParams}
        filterValueOptions={filterValueOptions}
        isDownloadListOpen={isDownloadListOpen}
        isFilterOpen={isFilterOpen}
        onApplyFilters={onApplyFilters}
        onDownloadOptionClick={onDownloadOptionClick}
        onEmptyListLabel={onEmptyListLabel}
        onExpandClick={onExpandClick}
        onFacetItemClick={onFacetItemClick}
        onFacetValueClick={onFacetValueClick}
        onFilterClick={onFilterClick}
        onFilterClose={onFilterClose}
        onFilterSearchChange={onFilterSearchChange}
        onFooterTabClick={onFooterTabClick}
        selectedFacetValues={selectedFacetValues}
        selectedFooterTab={selectedFooterTab}
        showFilterFooter={showFilterFooter}
        visualisationTitle={title}
      >
        {selectedFooterTab === 'table' && (
          <Table columns={tableColumns} data={data} />
        )}
      </Visualisation>
    </Wrapper>
  )
}

UniqueCitationCounts.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  filterParams: PropTypes.arrayOf(
    PropTypes.shape({
      isFacetSelected: PropTypes.bool.isRequired,
      type: PropTypes.string.isRequired,
      values: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          value: PropTypes.string.isRequired,
        }),
      ).isRequired,
    }),
  ).isRequired,
  filterValueOptions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ).isRequired,
  isFilterOpen: PropTypes.bool.isRequired,
  isDownloadListOpen: PropTypes.bool.isRequired,
  onApplyFilters: PropTypes.func.isRequired,
  onDownloadOptionClick: PropTypes.func.isRequired,
  onEmptyListLabel: PropTypes.string.isRequired,
  onExpandClick: PropTypes.func.isRequired,
  onFacetItemClick: PropTypes.func.isRequired,
  onFacetValueClick: PropTypes.func.isRequired,
  onFilterClick: PropTypes.func.isRequired,
  onFilterClose: PropTypes.func.isRequired,
  onFilterSearchChange: PropTypes.func.isRequired,
  onFooterTabClick: PropTypes.func.isRequired,
  selectedFooterTab: PropTypes.string.isRequired,
  selectedFacetValues: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ).isRequired,
  showFilterFooter: PropTypes.bool.isRequired,
  tableColumns: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      dataIndex: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
    }),
  ).isRequired,
}

export default UniqueCitationCounts
