import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Button as AntButton } from 'antd'

import { th, grid } from '@coko/client'

const StyledButton = styled(AntButton)`
  align-items: center;
  background-color: ${props =>
    props.selected
      ? props.theme.colorBackground
      : props.theme.colorTextPlaceholder};
  border: 1px solid ${th('colorPrimary')};
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  font-size: ${th('fontSizeChartFooterLabel')};
  font-weight: 500;
  gap: ${grid(2)};
  height: ${grid(11)};

  justify-content: center;
  margin: ${grid(0)} ${grid(-0.25)};
  ${({ selected, theme }) =>
    `color: ${selected ? theme.colorTertiary : theme.colorPrimary};`}
  padding: ${grid(2)} ${grid(3)};
  /* width: 25%; */

  &:hover {
    /* stylelint-disable declaration-no-important */
    color: ${th('colorTertiary')} !important;
    /* stylelint-enable declaration-no-important */
  }
`

const ButtonSymbol = styled.div`
  height: ${grid(7)};
  ${({ selected, defaultSymbol, selectedSymbol }) =>
    `background-image: url(${selected ? selectedSymbol : defaultSymbol});`}
  width: ${grid(7)};
`

const FooterButton = props => {
  const {
    children,
    defaultSymbol,
    loading,
    onClick,
    selected,
    selectedSymbol,
  } = props

  return (
    <StyledButton disabled={loading} onClick={onClick} selected={selected}>
      <ButtonSymbol
        defaultSymbol={defaultSymbol}
        selected={selected}
        selectedSymbol={selectedSymbol}
      />
      {children}
    </StyledButton>
  )
}

FooterButton.propTypes = {
  defaultSymbol: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  loading: PropTypes.bool,
  selected: PropTypes.bool,
  selectedSymbol: PropTypes.string.isRequired,
}

FooterButton.defaultProps = {
  loading: false,
  onClick: () => {},
  selected: false,
}

export default FooterButton
