import React from 'react'
import { uuid } from '@coko/client'

import { FacetValueItem } from '../../app/ui'

const label = 'Value item'
const selectedLabel = 'Selected item'
const id = uuid()

export const Base = args => <FacetValueItem {...args} id={id} value={label} />

export const ItemSelected = args => (
  <FacetValueItem {...args} id={id} isItemSelected value={selectedLabel} />
)

export default {
  component: FacetValueItem,
  title: 'Common/FacetValueItem',
}
