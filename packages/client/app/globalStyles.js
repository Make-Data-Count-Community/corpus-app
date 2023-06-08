/* stylelint-disable declaration-no-important */
import { createGlobalStyle } from 'styled-components'
import { th, grid } from '@coko/client'

export default createGlobalStyle`
  ::selection {
    background-color: ${th('colorSelection')} !important;
    color: ${th('colorBody')} !important;
    text-shadow: none;
  }

  #vg-tooltip-element.vg-tooltip.custom-theme {
    align-items: flex-start;
    background: ${th('colorPrimary')};
    box-shadow: ${grid(0)} ${grid(2)} ${grid(3)} rgba(36 59 84 / 10%);
    display: flex;
    flex-direction: column;
    gap: ${grid(2)};
    padding: ${grid(5)};
  }
`
