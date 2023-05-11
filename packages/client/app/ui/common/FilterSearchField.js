import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { grid } from '@coko/client'

import Search from '../../../static/symbol-search.svg'
import Input from './Input'

const SearchSymbol = styled.div`
  background-image: url(${Search});
  height: ${grid(7)};
  width: ${grid(7)};
`

const Wrapper = styled.div`
  box-sizing: border-box;
  padding: ${grid(2)} ${grid(2)} ${grid(1)};
  width: 100%;
`

const FilterSearchField = props => {
  const { onChange } = props

  return (
    <Wrapper>
      <Input
        onChange={onChange}
        placeholder="Search"
        prefix={<SearchSymbol />}
      />
    </Wrapper>
  )
}

FilterSearchField.propTypes = {
  onChange: PropTypes.func,
}

FilterSearchField.defaultProps = {
  onChange: () => {},
}

export default FilterSearchField
