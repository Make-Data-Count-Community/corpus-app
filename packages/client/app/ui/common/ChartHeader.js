import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { grid, th } from '@coko/client'
import { Popover as AntPopover } from 'antd'

import Title from './Title'
import FilterButton from './FilterButton'
import ExpandButton from './ExpandButton'
import FilterFacet from './FilterFacet'

const Wrapper = styled.div`
  background-color: ${th('colorChartBackground')};
  display: flex;
  font-size: ${th('fontSizeFilterLabel')};
  justify-content: space-between;
  margin: 0;
  padding: 0 ${grid(2)};
  width: 100%;
`

const Actions = styled.div`
  align-items: center;
  display: flex;
`

const ExpandButtonWrapper = styled(ExpandButton)`
  margin-left: ${grid(4)};
`

const ChartHeader = props => {
  const {
    title,
    filterParams,
    isFilterOpen,
    onApplyFilters,
    onFilterClose,
    onEmptyListLabel,
    onFacetItemClick,
    onFacetValueClick,
    onFilterClick,
    onExpandClick,
    onFilterSearchChange,
    selectedFacetValues,
    showFilterFooter,
    filterValueOptions,
  } = props

  return (
    <Wrapper>
      <Title>{title}</Title>
      <Actions>
        <AntPopover
          content={
            <FilterFacet
              filterParams={filterParams}
              onApplyFilters={onApplyFilters}
              onClose={onFilterClose}
              onEmptyListLabel={onEmptyListLabel}
              onFacetItemClick={onFacetItemClick}
              onFacetValueClick={onFacetValueClick}
              onSearchChange={onFilterSearchChange}
              selectedFacetValues={selectedFacetValues}
              showFooter={showFilterFooter}
              valueOptions={filterValueOptions}
            />
          }
          onOpenChange={onFilterClick}
          open={isFilterOpen}
          trigger="click"
        >
          <FilterButton>Filter Facets</FilterButton>
        </AntPopover>

        <ExpandButtonWrapper onClick={onExpandClick} />
      </Actions>
    </Wrapper>
  )
}

ChartHeader.propTypes = {
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
  isFilterOpen: PropTypes.bool.isRequired,
  onApplyFilters: PropTypes.func.isRequired,
  filterValueOptions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onExpandClick: PropTypes.func.isRequired,
  onEmptyListLabel: PropTypes.string.isRequired,
  onFacetItemClick: PropTypes.func.isRequired,
  onFacetValueClick: PropTypes.func.isRequired,
  onFilterClick: PropTypes.func.isRequired,
  onFilterClose: PropTypes.func.isRequired,
  onFilterSearchChange: PropTypes.func.isRequired,
  selectedFacetValues: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ).isRequired,
  showFilterFooter: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
}

export default ChartHeader
