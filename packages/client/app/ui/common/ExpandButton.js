import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Button as AntButton } from 'antd'

import ExpandSymbol from '../../../static/symbol-expand.svg'

const StyledButton = styled(AntButton)``

const FilterButton = props => {
  const { className, handleOnClick } = props
  return (
    <StyledButton
      className={className}
      icon={<img alt="Filter" src={ExpandSymbol} />}
      onClick={handleOnClick}
      type="text"
    />
  )
}

FilterButton.propTypes = {
  handleOnClick: PropTypes.func,
}

FilterButton.defaultProps = {
  handleOnClick: () => {},
}

export default FilterButton
