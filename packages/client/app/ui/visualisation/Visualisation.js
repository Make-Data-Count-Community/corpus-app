import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { grid, th } from '@coko/client'

import { ChartHeader, ChartFooter } from '../common'

const Wrapper = styled.div`
  align-items: flex-start;
  background: ${th('colorChartBackground')};
  display: flex;
  flex-direction: column;
  padding: ${grid(0)};
  width: 100%;
`

const DataWrapper = styled.div`
  height: ${grid(80)};
  overflow: auto;
  width: 100%;
`

const Visualisation = props => {
  const {
    children,
    downloadOptions,
    filterParams,
    filterValueOptions,
    isDownloadListOpen,
    isFilterOpen,
    onApplyFilters,
    onDownloadOptionClick,
    onExpandClick,
    onEmptyListLabel,
    onFacetItemClick,
    onFacetValueClick,
    onFilterClick,
    onFilterClose,
    onFilterSearchChange,
    onFooterTabClick,
    selectedFacetValues,
    selectedFooterTab,
    showFilterFooter,
    showFooterChartTab,
    visualisationTitle,
  } = props

  return (
    <Wrapper>
      <ChartHeader
        filterParams={filterParams}
        filterValueOptions={filterValueOptions}
        isFilterOpen={isFilterOpen}
        onApplyFilters={onApplyFilters}
        onEmptyListLabel={onEmptyListLabel}
        onExpandClick={onExpandClick}
        onFacetItemClick={onFacetItemClick}
        onFacetValueClick={onFacetValueClick}
        onFilterClick={onFilterClick}
        onFilterClose={onFilterClose}
        onFilterSearchChange={onFilterSearchChange}
        selectedFacetValues={selectedFacetValues}
        showFilterFooter={showFilterFooter}
        title={visualisationTitle}
      />
      <DataWrapper>{children}</DataWrapper>
      <ChartFooter
        downloadOptions={downloadOptions}
        isDowloadListOpen={isDownloadListOpen}
        onDownloadOptionClick={onDownloadOptionClick}
        onTabClick={onFooterTabClick}
        selectedTab={selectedFooterTab}
        showChartTab={showFooterChartTab}
      />
    </Wrapper>
  )
}

Visualisation.propTypes = {
  downloadOptions: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      symbol: PropTypes.string.isRequired,
    }),
  ).isRequired,
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
  isDownloadListOpen: PropTypes.bool.isRequired,
  isFilterOpen: PropTypes.bool,
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
  showFilterFooter: PropTypes.bool,
  showFooterChartTab: PropTypes.bool,
  visualisationTitle: PropTypes.string.isRequired,
}

Visualisation.defaultProps = {
  isFilterOpen: false,
  showFilterFooter: false,
  showFooterChartTab: false,
}

export default Visualisation
