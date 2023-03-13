/* stylelint-disable declaration-no-important */
import { createGlobalStyle } from 'styled-components'
import { th } from '@coko/client'

export default createGlobalStyle`
  ::selection {
    background-color: ${th('colorSelection')} !important;
    color: ${th('colorBody')} !important;
    text-shadow: none;
  }
`
