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
  flex-grow: 2;
  font-size: ${th('fontSizeBaseMedium')};
  justify-content: space-between;
  margin: 0;
  padding: 0 ${grid(2)};
  width: 100%;
`

const Actions = styled.div`
  align-items: flex-start;
  display: flex;
  margin: ${grid(4)} 0;
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
    showFilterButton,
    filterValueOptions,
  } = props

  return (
    <Wrapper>
      <Title>{title}</Title>
      <Actions>
        {showFilterButton && (
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
            placement="bottomRight"
            trigger="click"
          >
            <FilterButton>Filter Facets</FilterButton>
          </AntPopover>
        )}

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
  ),
  isFilterOpen: PropTypes.bool,
  onApplyFilters: PropTypes.func,
  filterValueOptions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ),
  onExpandClick: PropTypes.func.isRequired,
  onEmptyListLabel: PropTypes.string,
  onFacetItemClick: PropTypes.func,
  onFacetValueClick: PropTypes.func,
  onFilterClick: PropTypes.func,
  onFilterClose: PropTypes.func,
  onFilterSearchChange: PropTypes.func,
  selectedFacetValues: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ),
  showFilterButton: PropTypes.bool,
  showFilterFooter: PropTypes.bool,
  title: PropTypes.string.isRequired,
}

ChartHeader.defaultProps = {
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
  showFilterButton: false,
  showFilterFooter: false,
}

export default ChartHeader
