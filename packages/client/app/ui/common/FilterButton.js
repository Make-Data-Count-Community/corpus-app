import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Button as AntButton } from 'antd'

import { th, grid } from '@coko/client'

import Filter from '../../../static/symbol-filter.svg'

const StyledButton = styled(AntButton)`
  align-items: center;
  background: ${th('colorBackground')};
  border: 1px solid ${th('colorPrimary')};
  border-radius: ${grid(20)};
  box-sizing: border-box;
  display: flex;
  font-size: ${th('fontSizeBaseMedium')};
  font-weight: 500;
  gap: ${grid(4)};
  /* height: 48px; */
  line-height: ${grid(5)};
  padding: ${grid(4)} ${grid(8)};
  /* width: 147px; */
`

const FilterSymbol = styled.div`
  background-image: url(${Filter});
  height: ${grid(8)};
  width: ${grid(8)};
`

const FilterButton = props => {
  const { children, className, onClick } = props
  return (
    <StyledButton className={className} onClick={onClick}>
      {children}
      <FilterSymbol />
    </StyledButton>
  )
}

FilterButton.propTypes = {
  onClick: PropTypes.func,
}

FilterButton.defaultProps = {
  onClick: () => {},
}

export default FilterButton
