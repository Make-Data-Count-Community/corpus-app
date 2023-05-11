import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { th, grid } from '@coko/client'
import { Input as AntInput } from 'antd'

const Wrapper = styled.div``

const StyledInput = styled(AntInput)`
  border: 1px solid ${th('colorTextPlaceholder')};
  border-radius: ${grid(2)};
`

const Input = props => {
  const { className, onChange, placeholder, prefix } = props

  return (
    <Wrapper className={className}>
      <StyledInput
        onChange={onChange}
        placeholder={placeholder}
        prefix={prefix}
      />
    </Wrapper>
  )
}

Input.propTypes = {
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  prefix: PropTypes.element,
}

Input.defaultProps = {
  onChange: () => {},
  placeholder: '',
  prefix: null,
}

export default Input
