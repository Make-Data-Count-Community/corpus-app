import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { grid, th } from '@coko/client'

import Title from './Title'
import CloseButton from './CloseButton'

const Wrapper = styled.div`
  align-items: center;
  background-color: ${th('colorBackground')};
  border-bottom: 1px solid ${th('colorChartBackground')};
  display: flex;
  font-size: ${th('fontSizeHeading1')};
  justify-content: space-between;
  margin: 0;
  padding: 0 ${grid(2)};
  width: 100%;
`

const FilterHeader = props => {
  const { onClose } = props
  return (
    <Wrapper>
      <Title>Filter facets</Title>
      <CloseButton onClick={onClose} />
    </Wrapper>
  )
}

FilterHeader.propTypes = {
  onClose: PropTypes.func,
}

FilterHeader.defaultProps = {
  onClose: () => {},
}

export default FilterHeader
