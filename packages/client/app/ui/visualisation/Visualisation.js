import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { grid, th } from '@coko/client'

import { ChartHeader, ChartFooter } from '../common'

const Wrapper = styled.div`
  align-items: flex-end;
  background: ${th('colorChartBackground')};
  display: flex;
  flex-direction: column;
  /* flex-grow: 1; */
  height: 100%;
  justify-content: flex-end;
  /* margin: ${grid(2)}; */
  padding: ${grid(1)};
  width: 100%;
`

const DataWrapper = styled.div`
  /* flex-grow: 3; */
  height: ${grid(84)};
  overflow: auto;
  padding: ${grid(2)} ${grid(4)};
  width: 100%;
`

// const BodyWrapper = styled.div``

const Visualisation = props => {
  const {
    children,
    downloadOptions,
    expandPath,
    filterParams,
    filterValueOptions,
    isDownloadListOpen,
    isFilterOpen,
    onApplyFilters,
    onDownloadOptionClick,
    onEmptyListLabel,
    onFacetItemClick,
    onFacetValueClick,
    onFilterClick,
    onFilterClose,
    onFilterSearchChange,
    onFooterTabClick,
    selectedFacetValues,
    selectedFooterTab,
    showExpandButton,
    showFilterButton,
    showFilterFooter,
    showFooterChartTab,
    visualisationTitle,
  } = props

  return (
    <Wrapper id="visWrapper">
      <ChartHeader
        expandPath={expandPath}
        filterParams={filterParams}
        filterValueOptions={filterValueOptions}
        isFilterOpen={isFilterOpen}
        onApplyFilters={onApplyFilters}
        onEmptyListLabel={onEmptyListLabel}
        onFacetItemClick={onFacetItemClick}
        onFacetValueClick={onFacetValueClick}
        onFilterClick={onFilterClick}
        onFilterClose={onFilterClose}
        onFilterSearchChange={onFilterSearchChange}
        selectedFacetValues={selectedFacetValues}
        showExpandButton={showExpandButton}
        showFilterButton={showFilterButton}
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
  expandPath: PropTypes.string.isRequired,
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
  ),
  filterValueOptions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ),
  isDownloadListOpen: PropTypes.bool.isRequired,
  isFilterOpen: PropTypes.bool,
  onApplyFilters: PropTypes.func,
  onDownloadOptionClick: PropTypes.func.isRequired,
  onEmptyListLabel: PropTypes.string,
  onFacetItemClick: PropTypes.func,
  onFacetValueClick: PropTypes.func,
  onFilterClick: PropTypes.func,
  onFilterClose: PropTypes.func,
  onFilterSearchChange: PropTypes.func,
  onFooterTabClick: PropTypes.func.isRequired,
  selectedFacetValues: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ),
  selectedFooterTab: PropTypes.string.isRequired,
  showExpandButton: PropTypes.bool,
  showFilterButton: PropTypes.bool,
  showFilterFooter: PropTypes.bool,
  showFooterChartTab: PropTypes.bool,
  visualisationTitle: PropTypes.string.isRequired,
}

Visualisation.defaultProps = {
  filterParams: [],
  filterValueOptions: [],
  isFilterOpen: false,
  onApplyFilters: () => {},
  onEmptyListLabel: '',
  onFacetItemClick: () => {},
  onFacetValueClick: () => {},
  onFilterClick: () => {},
  onFilterClose: () => {},
  onFilterSearchChange: () => {},
  selectedFacetValues: [],
  showExpandButton: false,
  showFilterButton: false,
  showFilterFooter: false,
  showFooterChartTab: false,
}

export default Visualisation
