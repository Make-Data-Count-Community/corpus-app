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
  display: flex;
  flex-direction: column;
  height: ${({ expandedView }) => grid(expandedView ? 150 : 100)};
  justify-content: flex-end;
  padding: ${grid(2)} ${grid(4)};
  width: 100%;
`

const SpinWrapper = styled(Spin)`
  height: 100%;
`

const ChildrenWrapper = styled.div`
  height: ${({ expandedView }) => grid(expandedView ? 140 : 90)};
  overflow: ${({ showOverflow }) => (showOverflow ? 'auto' : 'hidden')};
`

const OtherDataWrapper = styled.div`
  height: ${grid(8)};
  padding: 0 ${grid(2)};
  width: 100%;
`

const Visualisation = props => {
  const {
    children,
    downloadOptions,
    expandPath,
    facetType,
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
    otherCount,
    selectedFacetCount,
    selectedFacetValues,
    selectedFooterTab,
    showExpandButton,
    showFilterButton,
    showApplyFilterButton,
    showClearFilterButton,
    showFooterChartTab,
    topFacetCount,
    visualisationTitle,
  } = props

  return (
    <Wrapper>
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
        selectedFacetCount={selectedFacetCount}
        selectedFacetValues={selectedFacetValues}
        showApplyFilterButton={showApplyFilterButton}
        showClearFilterButton={showClearFilterButton}
        showExpandButton={showExpandButton}
        showFilterButton={showFilterButton}
        title={visualisationTitle}
      />
      <DataWrapper expandedView={!showExpandButton}>
        <SpinWrapper renderBackground={false} spinning={loading}>
          <ChildrenWrapper
            expandedView={!showExpandButton}
            showOverflow={selectedFooterTab === 'table'}
          >
            {children}
          </ChildrenWrapper>
        </SpinWrapper>
      </DataWrapper>
      {!!otherCount && !loading && (
        <OtherDataWrapper>
          The visualization includes the top {topFacetCount} {facetType}
          {topFacetCount !== 1 ? 's' : ''} where metadata is available.
        </OtherDataWrapper>
      )}
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
  facetType: PropTypes.string,
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
  otherCount: PropTypes.number,
  selectedFacetCount: PropTypes.number,
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
  topFacetCount: PropTypes.number,
  visualisationTitle: PropTypes.string.isRequired,
}

Visualisation.defaultProps = {
  facetType: '',
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
  otherCount: 0,
  selectedFacetCount: 0,
  selectedFacetValues: [],
  showExpandButton: false,
  showFilterButton: false,
  showApplyFilterButton: false,
  showClearFilterButton: false,
  showFooterChartTab: false,
  topFacetCount: 0,
}

export default Visualisation
