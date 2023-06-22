import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

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
    expandPath,
    title,
    filterParams,
    isFilterOpen,
    loading,
    onApplyFilters,
    onFilterClose,
    onEmptyListLabel,
    onFacetItemClick,
    onFacetValueClick,
    onFilterClick,
    onFilterSearchChange,
    selectedFacetValues,
    showExpandButton,
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
            onOpenChange={loading ? () => {} : onFilterClick}
            open={loading ? false : isFilterOpen}
            placement="bottomRight"
            trigger="click"
          >
            <FilterButton>Filter Facets</FilterButton>
          </AntPopover>
        )}

        {showExpandButton && (
          <Link target="_blank" to={expandPath}>
            <ExpandButtonWrapper />
          </Link>
        )}
      </Actions>
    </Wrapper>
  )
}

ChartHeader.propTypes = {
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
  isFilterOpen: PropTypes.bool,
  loading: PropTypes.bool,
  onApplyFilters: PropTypes.func,
  filterValueOptions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      value: PropTypes.string,
    }),
  ),
  onEmptyListLabel: PropTypes.string,
  onFacetItemClick: PropTypes.func,
  onFacetValueClick: PropTypes.func,
  onFilterClick: PropTypes.func,
  onFilterClose: PropTypes.func,
  onFilterSearchChange: PropTypes.func,
  selectedFacetValues: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      value: PropTypes.string,
    }),
  ),
  showExpandButton: PropTypes.bool.isRequired,
  showFilterButton: PropTypes.bool,
  showFilterFooter: PropTypes.bool,
  title: PropTypes.string.isRequired,
}

ChartHeader.defaultProps = {
  filterParams: [],
  filterValueOptions: [],
  isFilterOpen: false,
  loading: false,
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
