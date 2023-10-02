import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Button as AntButton } from 'antd'

import ExpandSymbol from '../../../static/symbol-expand.svg'

const StyledButton = styled(AntButton)``

const FilterButton = props => {
  const { className, onClick } = props
  return (
    <StyledButton
      className={className}
      icon={<img alt="Filter" src={ExpandSymbol} />}
      onClick={onClick}
      type="text"
    />
  )
}

FilterButton.propTypes = {
  onClick: PropTypes.func,
}

FilterButton.defaultProps = {
  onClick: () => {},
}

export default FilterButton
