import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { th, grid } from '@coko/client'

const ItemLabel = styled.span`
  color: ${th('colorPrimary')};
  font-size: ${th('fontSizeBase')};
  font-weight: 400;
  line-height: ${grid(6)};
`

const ItemWrapper = styled.div`
  align-items: center;
  background: ${th('colorBackground')};
  cursor: pointer;
  display: flex;
  ${({ selected }) => selected && `background: rgba(0, 177, 226, 0.2);`}
  padding: ${grid(2)} ${grid(5)};
  width: 100%;
`

const FacetValueItem = props => {
  const { id, onItemClick, isItemSelected, value } = props

  return (
    <ItemWrapper onClick={() => onItemClick(id)} selected={isItemSelected}>
      <ItemLabel>{value}</ItemLabel>
    </ItemWrapper>
  )
}

FacetValueItem.propTypes = {
  id: PropTypes.string.isRequired,
  isItemSelected: PropTypes.bool,
  onItemClick: PropTypes.func,
  value: PropTypes.string.isRequired,
}

FacetValueItem.defaultProps = {
  isItemSelected: false,
  onItemClick: () => {},
}

export default FacetValueItem
