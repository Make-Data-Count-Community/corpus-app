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
  font-size: ${th('fontSizeFilterLabel')};
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
  const { children, className, handleOnClick } = props
  return (
    <StyledButton
      className={className}
      //   icon={<img alt="Filter" src={FilterSymbol} />}
      onClick={handleOnClick}
    >
      {children}
      <FilterSymbol />
    </StyledButton>
  )
}

FilterButton.propTypes = {
  handleOnClick: PropTypes.func,
}

FilterButton.defaultProps = {
  handleOnClick: () => {},
}

export default FilterButton
