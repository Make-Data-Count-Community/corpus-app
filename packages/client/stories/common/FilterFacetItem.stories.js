import React from 'react'

import { FilterFacetItem } from '../../app/ui'

const label = 'Facet item'
const selectedLabel = 'Selected facet item'
const selectedValuesLabel = 'Facet item with selected values'
const selectedItemAndValuesLabel = 'Selected facet item with selected values'
const type = 'doi'

const selectedValues = [
  { id: 'id1', value: 'test1' },
  { id: 'id3', value: 'test3' },
]

export const Base = args => (
  <FilterFacetItem {...args} label={label} type={type} />
)
export const FacetSelected = args => (
  <FilterFacetItem
    {...args}
    isFacetSelected
    label={selectedLabel}
    type={type}
  />
)
export const ValuesSelected = args => (
  <FilterFacetItem
    {...args}
    label={selectedValuesLabel}
    selectedValues={selectedValues}
    type={type}
  />
)
export const FacetAndValuesSelected = args => (
  <FilterFacetItem
    {...args}
    isFacetSelected
    label={selectedItemAndValuesLabel}
    selectedValues={selectedValues}
    type={type}
  />
)

export default {
  component: FilterFacetItem,
  title: 'Common/FilterFacetItem',
}
