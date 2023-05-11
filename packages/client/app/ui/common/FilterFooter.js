import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { th, grid } from '@coko/client'
import { Button as AntButton } from 'antd'

const Wrapper = styled.div`
  align-items: center;
  background-color: ${th('colorBackground')};
  border-top: 1px solid ${th('colorChartBackground')};
  display: flex;
  justify-content: flex-end;
  padding: ${grid(3)};
  width: 100%;
`

const ApplyFiltersButton = styled(AntButton)`
  background-color: ${th('colorApplyFilters')};
  border-radius: ${grid(10)};
  color: ${th('colorBackground')};
`

const FilterFooter = props => {
  const { onApplyFilters } = props

  return (
    <Wrapper>
      <ApplyFiltersButton onClick={onApplyFilters}>
        Apply filter
      </ApplyFiltersButton>
    </Wrapper>
  )
}

FilterFooter.propTypes = {
  onApplyFilters: PropTypes.func,
}

FilterFooter.defaultProps = {
  onApplyFilters: () => {},
}

export default FilterFooter
