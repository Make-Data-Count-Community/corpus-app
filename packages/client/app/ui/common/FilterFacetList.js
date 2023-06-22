import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { grid, th } from '@coko/client'
import { List as AntList } from 'antd'

import FilterFacetItem from './FilterFacetItem'

const typeResolver = type => {
  const typeMap = [
    { type: 'doi', value: 'Dataset identifier (DOI)' },
    { type: 'accession', value: 'Accession number' },
    { type: 'repository', value: 'Repository' },
    { type: 'subject', value: 'Subject' },
    { type: 'affiliation', value: 'Affiliation' },
    { type: 'funder', value: 'Funder' },
    { type: 'journal', value: 'Journal' },
    { type: 'publisher', value: 'Publisher' },
  ]

  return typeMap.find(t => t.type === type).value
}

const FacetListWrapper = styled.div`
  align-items: flex-start;
  border-right: 1px solid ${th('colorChartBackground')};
  display: flex;
  flex-direction: column;
  height: ${grid(96)};
  padding: ${grid(0)};
  width: 100%;
`

const List = styled(AntList)`
  width: 100%;
`

const FilterFacetList = props => {
  const { filterParams, onItemClick } = props

  return (
    <FacetListWrapper>
      <List
        dataSource={filterParams}
        renderItem={item => (
          <FilterFacetItem
            isFacetSelected={item.isFacetSelected}
            key={item.type}
            label={typeResolver(item.type)}
            onItemClick={onItemClick}
            selectedValues={item.values}
            type={item.type}
          />
        )}
      />
    </FacetListWrapper>
  )
}

FilterFacetList.propTypes = {
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
  onItemClick: PropTypes.func,
}

FilterFacetList.defaultProps = {
  filterParams: [],
  onItemClick: () => {},
}

export default FilterFacetList
