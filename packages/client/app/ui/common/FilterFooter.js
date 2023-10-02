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
  gap: ${grid(4)};
  justify-content: flex-end;
  padding: ${grid(3)};
  width: 100%;
`

const ClearFiltersButton = styled(AntButton)`
  background-color: ${th('colorBackground')};
  border-radius: ${grid(10)};
  color: ${th('colorApplyFilters')};
`

const ApplyFiltersButton = styled(AntButton)`
  background-color: ${th('colorApplyFilters')};
  border-radius: ${grid(10)};
  color: ${th('colorBackground')};
`

const FilterFooter = props => {
  const {
    onApplyFilters,
    onClearFilters,
    showApplyFilterButton,
    showClearFilterButton,
  } = props

  return (
    <Wrapper>
      {showClearFilterButton && (
        <ClearFiltersButton onClick={onClearFilters}>
          Clear filter
        </ClearFiltersButton>
      )}
      {showApplyFilterButton && (
        <ApplyFiltersButton onClick={onApplyFilters}>
          Apply filter
        </ApplyFiltersButton>
      )}
    </Wrapper>
  )
}

FilterFooter.propTypes = {
  onApplyFilters: PropTypes.func,
  onClearFilters: PropTypes.func,
  showApplyFilterButton: PropTypes.bool,
  showClearFilterButton: PropTypes.bool,
}

FilterFooter.defaultProps = {
  onApplyFilters: () => {},
  onClearFilters: () => {},
  showApplyFilterButton: false,
  showClearFilterButton: false,
}

export default FilterFooter
