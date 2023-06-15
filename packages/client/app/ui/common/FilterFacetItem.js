import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { th, grid } from '@coko/client'

import Tick from '../../../static/symbol-tick.svg'
import { Text } from './Typography'

const ItemLabel = styled.span`
  color: ${th('colorPrimary')};
  font-size: ${th('fontSizeBase')};
  font-weight: 500;
  line-height: ${grid(6)};
`

const TickSymbol = styled.div`
  background-image: url(${Tick});
  height: ${grid(2.25)};
  width: ${grid(2.5)};
`

const ItemWrapper = styled.div`
  background: ${th('colorBackground')};
  border-bottom: 1px solid ${th('colorChartBackground')};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  ${({ selected }) => selected && `background: rgba(0, 177, 226, 0.2);`}
  padding: ${grid(3)} ${grid(6)};
  width: 100%;

  &:hover {
    ${({ selected, theme }) =>
      `background: ${
        selected ? theme.colorSelectedFacet : theme.colorChartBackground
      };`}
  }
`

const ItemHeader = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
`

const SelectedValuesWrapper = styled(Text)`
  font-size: ${th('fontSizeBaseSmall')};
  font-weight: 400;
`

const FilterFacetItem = props => {
  const { label, onItemClick, isFacetSelected, selectedValues, type } = props

  return (
    <ItemWrapper onClick={() => onItemClick(type)} selected={isFacetSelected}>
      <ItemHeader>
        <ItemLabel>{label}</ItemLabel>
        {!!selectedValues.length && <TickSymbol />}
      </ItemHeader>
      {!!selectedValues.length && (
        <SelectedValuesWrapper>
          {selectedValues.map(s => s.title).join(', ')}
        </SelectedValuesWrapper>
      )}
    </ItemWrapper>
  )
}

FilterFacetItem.propTypes = {
  onItemClick: PropTypes.func,
  label: PropTypes.string.isRequired,
  isFacetSelected: PropTypes.bool,
  selectedValues: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ),
  type: PropTypes.string.isRequired,
}

FilterFacetItem.defaultProps = {
  onItemClick: () => {},
  isFacetSelected: false,
  selectedValues: [],
}

export default FilterFacetItem
