import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { grid, th } from '@coko/client'

import { ChartHeader, ChartFooter, Spin } from '../common'

const Wrapper = styled.div`
  align-items: flex-end;
  background: ${th('colorChartBackground')};
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: 100%;
  padding: ${grid(1)};
  width: 100%;
`

const DataWrapper = styled.div`
  height: ${grid(90)};
  overflow: auto;
  padding: ${grid(2)} ${grid(4)};
  width: 100%;
`

const Visualisation = props => {
  const {
    children,
    downloadOptions,
    expandPath,
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
    selectedFacetValues,
    selectedFooterTab,
    showExpandButton,
    showFilterButton,
    showApplyFilterButton,
    showClearFilterButton,
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
        loading={loading}
        onApplyFilters={onApplyFilters}
        onClearFilters={onClearFilters}
        onEmptyListLabel={onEmptyListLabel}
        onFacetItemClick={onFacetItemClick}
        onFacetValueClick={onFacetValueClick}
        onFilterClick={onFilterClick}
        onFilterClose={onFilterClose}
        onFilterSearchChange={onFilterSearchChange}
        selectedFacetValues={selectedFacetValues}
        showApplyFilterButton={showApplyFilterButton}
        showClearFilterButton={showClearFilterButton}
        showExpandButton={showExpandButton}
        showFilterButton={showFilterButton}
        title={visualisationTitle}
      />
      <DataWrapper>
        <Spin renderBackground={false} spinning={loading}>
          {children}
        </Spin>
      </DataWrapper>
      <ChartFooter
        downloadOptions={downloadOptions}
        isDowloadListOpen={isDownloadListOpen}
        loading={loading}
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
      type: PropTypes.string,
      label: PropTypes.string,
      symbol: PropTypes.string,
    }),
  ).isRequired,
  expandPath: PropTypes.string.isRequired,
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
  ),
  filterValueOptions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      value: PropTypes.string,
    }),
  ),
  isDownloadListOpen: PropTypes.bool.isRequired,
  isFilterOpen: PropTypes.bool,
  loading: PropTypes.bool,
  onApplyFilters: PropTypes.func,
  onClearFilters: PropTypes.func,
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
      id: PropTypes.string,
      value: PropTypes.string,
    }),
  ),
  selectedFooterTab: PropTypes.string.isRequired,
  showExpandButton: PropTypes.bool,
  showFilterButton: PropTypes.bool,
  showApplyFilterButton: PropTypes.bool,
  showClearFilterButton: PropTypes.bool,
  showFooterChartTab: PropTypes.bool,
  visualisationTitle: PropTypes.string.isRequired,
}

Visualisation.defaultProps = {
  filterParams: [],
  filterValueOptions: [],
  isFilterOpen: false,
  loading: false,
  onApplyFilters: () => {},
  onClearFilters: () => {},
  onEmptyListLabel: '',
  onFacetItemClick: () => {},
  onFacetValueClick: () => {},
  onFilterClick: () => {},
  onFilterClose: () => {},
  onFilterSearchChange: () => {},
  selectedFacetValues: [],
  showExpandButton: false,
  showFilterButton: false,
  showApplyFilterButton: false,
  showClearFilterButton: false,
  showFooterChartTab: false,
}

export default Visualisation
