import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { grid } from '@coko/client'

import FilterHeader from './FilterHeader'
import FilterFacetList from './FilterFacetList'
import FilterSearchField from './FilterSearchField'
import FacetValueList from './FacetValueList'
import FilterFooter from './FilterFooter'

const Wrapper = styled.div`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  padding: 0;
  width: ${grid(128)};
`

const FilterBody = styled.div`
  align-items: flex-start;
  display: flex;
  max-height: ${grid(96)};
  padding: 0;
  width: 100%;
`

const FilterFacetListWrapper = styled.div`
  height: ${grid(96)};
  overflow: auto;
  width: ${grid(64)};
`

const FacetValueWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: ${grid(96)};
  overflow: auto;
  width: ${grid(64)};
`

const FilterFacet = props => {
  const {
    selectedFacetValues,
    filterParams,
    onApplyFilters,
    onEmptyListLabel,
    onFacetItemClick,
    onFacetValueClick,
    onClose,
    onSearchChange,
    showFooter,
    valueOptions,
  } = props

  return (
    <Wrapper>
      <FilterHeader onClose={onClose} />
      <FilterBody>
        <FilterFacetListWrapper>
          <FilterFacetList
            filterParams={filterParams}
            onItemClick={onFacetItemClick}
          />
        </FilterFacetListWrapper>
        <FacetValueWrapper>
          <FilterSearchField onChange={onSearchChange} />
          <FacetValueList
            onEmptyListLabel={onEmptyListLabel}
            onItemClick={onFacetValueClick}
            selectedFacetValues={selectedFacetValues}
            valueOptions={valueOptions}
          />
        </FacetValueWrapper>
      </FilterBody>
      {showFooter && <FilterFooter onApplyFilters={onApplyFilters} />}
    </Wrapper>
  )
}

FilterFacet.propTypes = {
  selectedFacetValues: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
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
  onApplyFilters: PropTypes.func.isRequired,
  onEmptyListLabel: PropTypes.string.isRequired,
  onFacetItemClick: PropTypes.func.isRequired,
  onFacetValueClick: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  showFooter: PropTypes.bool.isRequired,
  valueOptions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ).isRequired,
}

export default FilterFacet
