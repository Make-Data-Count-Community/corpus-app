import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { grid, th } from '@coko/client'

import Title from './Title'
import FilterButton from './FilterButton'
import ExpandButton from './ExpandButton'

const Wrapper = styled.div`
  background-color: ${th('colorChartBackground')};
  display: flex;
  font-size: ${th('fontSizeFilterLabel')};
  justify-content: space-between;
  margin: 0;
  padding: 0 ${grid(2)};
  width: 100%;
`

const Actions = styled.div`
  align-items: center;
  display: flex;
`

const ExpandButtonWrapper = styled(ExpandButton)`
  margin-left: ${grid(4)};
`

const ChartHeader = props => {
  const { title } = props

  return (
    <Wrapper>
      <Title>{title}</Title>
      <Actions>
        <FilterButton>Filter Facets</FilterButton>
        <ExpandButtonWrapper />
      </Actions>
    </Wrapper>
  )
}

ChartHeader.propTypes = {
  title: PropTypes.string.isRequired,
}

export default ChartHeader
