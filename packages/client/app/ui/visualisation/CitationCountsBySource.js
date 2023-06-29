import React from 'react'
import PropTypes from 'prop-types'

import Visualisation from './Visualisation'
import { StackedBarChart, Table } from '../common'

import CsvSymbol from '../../../static/symbol-csv-file.svg'
// import PdfSymbol from '../../../static/symbol-pdf-file.svg'
import PngSymbol from '../../../static/symbol-png-file.svg'
import SvgSymbol from '../../../static/symbol-svg-file.svg'

const title = 'Citation counts by source of citation'
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

const expandPath = '/visualisation/citation-counts-by-source'

const CitationCountsBySource = props => {
  const {
    data,
    filterParams,
    filterValueOptions,
    isDownloadListOpen,
    isFilterOpen,
    loading,
    onApplyFilters,
    onClearFilters,
    onDownloadOptionClick,
    onEmptyListLabel,
    onFacetItemClick,
    onFacetValueClick,
    onFilterClick,
    onFilterClose,
    onFilterSearchChange,
    onFooterTabClick,
    onNewView,
    selectedFooterTab,
    selectedFacetCount,
    selectedFacetValues,
    showExpandButton,
    showApplyFilterButton,
    showClearFilterButton,
    tableColumns,
  } = props

  return (
    <Visualisation
      downloadOptions={downloadOptions}
      expandPath={expandPath}
      filterParams={filterParams}
      filterValueOptions={filterValueOptions}
      isDownloadListOpen={isDownloadListOpen}
      isFilterOpen={isFilterOpen}
      loading={loading}
      onApplyFilters={onApplyFilters}
      onClearFilters={onClearFilters}
      onDownloadOptionClick={onDownloadOptionClick}
      onEmptyListLabel={onEmptyListLabel}
      onFacetItemClick={onFacetItemClick}
      onFacetValueClick={onFacetValueClick}
      onFilterClick={onFilterClick}
      onFilterClose={onFilterClose}
      onFilterSearchChange={onFilterSearchChange}
      onFooterTabClick={onFooterTabClick}
      selectedFacetCount={selectedFacetCount}
      selectedFacetValues={selectedFacetValues}
      selectedFooterTab={selectedFooterTab}
      showApplyFilterButton={showApplyFilterButton}
      showClearFilterButton={showClearFilterButton}
      showExpandButton={showExpandButton}
      showFilterButton
      showFooterChartTab
      visualisationTitle={title}
    >
      {selectedFooterTab === 'chart' && (
        <StackedBarChart
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

CitationCountsBySource.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  filterParams: PropTypes.arrayOf(
    PropTypes.shape({
      isFacetSelected: PropTypes.bool,
      type: PropTypes.string,
      values: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          value: PropTypes.string,
        }),
      ),
    }),
  ).isRequired,
  filterValueOptions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      value: PropTypes.string,
    }),
  ).isRequired,
  isFilterOpen: PropTypes.bool.isRequired,
  isDownloadListOpen: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  onApplyFilters: PropTypes.func.isRequired,
  onClearFilters: PropTypes.func.isRequired,
  onDownloadOptionClick: PropTypes.func.isRequired,
  onEmptyListLabel: PropTypes.string.isRequired,
  onFacetItemClick: PropTypes.func.isRequired,
  onFacetValueClick: PropTypes.func.isRequired,
  onFilterClick: PropTypes.func.isRequired,
  onFilterClose: PropTypes.func.isRequired,
  onFilterSearchChange: PropTypes.func.isRequired,
  onFooterTabClick: PropTypes.func.isRequired,
  onNewView: PropTypes.func.isRequired,
  selectedFooterTab: PropTypes.string.isRequired,
  selectedFacetCount: PropTypes.number.isRequired,
  selectedFacetValues: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      value: PropTypes.string,
    }),
  ).isRequired,
  showExpandButton: PropTypes.bool,
  showApplyFilterButton: PropTypes.bool.isRequired,
  showClearFilterButton: PropTypes.bool.isRequired,
  tableColumns: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      dataIndex: PropTypes.string,
      key: PropTypes.string,
    }),
  ).isRequired,
}

CitationCountsBySource.defaultProps = {
  showExpandButton: false,
}

export default CitationCountsBySource
