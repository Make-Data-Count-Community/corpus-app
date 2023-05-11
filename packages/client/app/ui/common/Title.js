import React from 'react'
import styled from 'styled-components'

import { H1 } from './Headings'

const TitleWrapper = styled(H1)`
  margin-bottom: -0.5em;
`

const Title = props => {
  const { children } = props

  return <TitleWrapper>{children}</TitleWrapper>
}

Title.propTypes = {}

export default Title
