import React, { useState } from 'react'

import { FilterFacetList } from '../../app/ui'

const facetFilters = [
  {
    isFacetSelected: false,
    type: 'publisher',
    values: [],
  },
  {
    isFacetSelected: false,
    type: 'affiliation',
    values: [],
  },
  {
    isFacetSelected: false,
    type: 'funder',
    values: [],
  },
]

const Template = args => {
  const [filters, setFilters] = useState(facetFilters)

  const handleOnClick = facetType => {
    const facetIndex = filters.findIndex(f => f.type === facetType)

    setFilters(
      filters.map((f, i) => ({ ...f, isFacetSelected: i === facetIndex })),
    )
  }

  return (
    <FilterFacetList
      {...args}
      filterParams={filters}
      onItemClick={handleOnClick}
    />
  )
}

export const Base = Template.bind({})

export default {
  component: FilterFacetList,
  title: 'Common/FilterFacetList',
}
