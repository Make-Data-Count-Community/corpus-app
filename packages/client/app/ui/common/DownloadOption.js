import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { th, grid } from '@coko/client'

const OptionSymbol = styled.div`
  height: ${grid(7)};
  ${({ symbol }) => `background-image: url(${symbol});`}
  width: ${grid(7)};
`

const OptionLabel = styled.span`
  color: ${th('colorPrimary')};
  font-weight: ${th('fontSizeChartFooterLabel')};
  line-height: ${grid(6)};
`

const OptionWrapper = styled.div`
  align-items: center;
  background: ${th('colorBackground')};
  border-bottom: ${grid(0.25)} solid ${th('colorChartBackground')};
  box-sizing: border-box;
  cursor: pointer;
  display: flex;
  gap: ${grid(2)};
  height: ${grid(13)};
  padding: ${grid(3)};
  width: 100%;
`

const DownloadOption = props => {
  const { label, onOptionClick, symbol, type } = props

  return (
    <OptionWrapper onClick={() => onOptionClick(type)}>
      <OptionSymbol symbol={symbol} />
      <OptionLabel>{label}</OptionLabel>
    </OptionWrapper>
  )
}

DownloadOption.propTypes = {
  label: PropTypes.string.isRequired,
  onOptionClick: PropTypes.func,
  symbol: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
}

DownloadOption.defaultProps = {
  onOptionClick: () => {},
}

export default DownloadOption
