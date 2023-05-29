import React from 'react'
import styled from 'styled-components'

import { grid } from '@coko/client'

import { H1 } from './Headings'

const TitleWrapper = styled(H1)`
  align-items: flex-start;
  display: flex;
  margin: ${grid(4)} 0;
`

const Title = props => {
  const { children } = props

  return <TitleWrapper>{children}</TitleWrapper>
}

Title.propTypes = {}

export default Title
