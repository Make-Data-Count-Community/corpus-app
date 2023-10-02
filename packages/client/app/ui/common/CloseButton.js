import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'antd'

import CloseSymbol from '../../../static/symbol-close.svg'

const SymbolButton = props => {
  const { className, onClick } = props
  return (
    <Button
      className={className}
      icon={<img alt="Filter" src={CloseSymbol} />}
      onClick={onClick}
      type="text"
    />
  )
}

SymbolButton.propTypes = {
  onClick: PropTypes.func,
}

SymbolButton.defaultProps = {
  onClick: () => {},
}

export default SymbolButton
