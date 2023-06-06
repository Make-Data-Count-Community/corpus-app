import React from 'react'
import PropTypes from 'prop-types'

import Visualisation from './Visualisation'
import { StackedBarChart, Table } from '../common'

import CsvSymbol from '../../../static/symbol-csv-file.svg'
// import PdfSymbol from '../../../static/symbol-pdf-file.svg'
import PngSymbol from '../../../static/symbol-png-file.svg'
import SvgSymbol from '../../../static/symbol-svg-file.svg'

const title = 'Citation counts over time'
const stackField = 'stackField'
const stackItems = ['DOI', 'Accession ID']
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

const expandPath = '/visualisation/citation-counts-over-time'

const CitationCountsOverTime = props => {
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
    onNewView,
    selectedFooterTab,
    selectedFacetValues,
    showExpandButton,
    showFilterFooter,
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
      showExpandButton={showExpandButton}
      showFilterButton
      showFilterFooter={showFilterFooter}
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

CitationCountsOverTime.propTypes = {
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
  onNewView: PropTypes.func.isRequired,
  selectedFooterTab: PropTypes.string.isRequired,
  selectedFacetValues: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ).isRequired,
  showExpandButton: PropTypes.bool.isRequired,
  showFilterFooter: PropTypes.bool.isRequired,
  tableColumns: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      dataIndex: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
    }),
  ).isRequired,
}

export default CitationCountsOverTime
