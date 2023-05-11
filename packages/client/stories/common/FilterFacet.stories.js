import React, { useEffect, useState } from 'react'
import { lorem } from 'faker'
import { uuid } from '@coko/client/dist'

import { FilterFacet } from '../../app/ui'

const filterParams = [
  {
    isFacetSelected: false,
    type: 'doi',
    values: [],
  },
  {
    isFacetSelected: false,
    type: 'accession',
    values: [],
  },
  {
    isFacetSelected: false,
    type: 'repository',
    values: [],
  },
  {
    isFacetSelected: false,
    type: 'subject',
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
  {
    isFacetSelected: false,
    type: 'journal',
    values: [],
  },
  {
    isFacetSelected: false,
    type: 'publisher',
    values: [],
  },
]

const fullFacetOptions = [
  { type: 'doi', values: [] },
  { type: 'accession', values: [] },
  {
    type: 'repository',
    values: [
      {
        id: uuid(),
        value: `CZI`,
      },
      {
        id: uuid(),
        value: `DataCite Event Date`,
      },
      {
        id: uuid(),
        value: `OpenAIRE`,
      },
    ],
  },
  {
    type: 'subject',
    values: [
      {
        id: uuid(),
        value: `Subject 1 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Subject 2 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Subject 3 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Subject 4 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Subject 5 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Subject 6 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Subject 7 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Subject 8 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Subject 9 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Subject 10 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Subject 11 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Subject 12 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Subject 13 ${lorem.words(2)}`,
      },
    ],
  },
  {
    type: 'journal',
    values: [
      {
        id: uuid(),
        value: `Journal 1 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Journal 2 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Journal 3 ${lorem.words(2)}`,
      },
    ],
  },
  {
    type: 'publisher',
    values: [
      {
        id: uuid(),
        value: `Publisher 1 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Publisher 2 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Publisher 3 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Publisher 4 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Publisher 5 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Publisher 6 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Publisher 7 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Publisher 8 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Publisher 9 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Publisher 10 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Publisher 11 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Publisher 12 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Publisher 13 ${lorem.words(2)}`,
      },
    ],
  },
  {
    type: 'affiliation',
    values: [
      {
        id: uuid(),
        value: `Affiliate 1 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Affiliate 2 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Affiliate 3 ${lorem.words(2)}`,
      },
    ],
  },
  {
    type: 'funder',
    values: [
      {
        id: uuid(),
        value: `Funder 1 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Funder 2 ${lorem.words(2)}`,
      },
      {
        id: uuid(),
        value: `Funder 3 ${lorem.words(2)}`,
      },
    ],
  },
]

const facetNotSelectedLabel = 'Please select a facet'
const displayListEmptyLabel = 'No matches found'

const Template = args => {
  const [filters, setFilters] = useState(filterParams)
  const [displayFacetValues, setDisplayFacetValues] = useState([])
  const [selectedFacetValues, setSelectedFacetValues] = useState([])
  const [totalSelectionCount, setTotalSelectionCount] = useState(0)

  const [emptyFacetValueListLabel, setEmptyFacetValueListLabel] = useState(
    facetNotSelectedLabel,
  )

  const countSelections = () => {
    // console.log(totalSelectionCount)
    let count = 0
    // eslint-disable-next-line no-return-assign
    filters.map(f => (count += f.values.length))

    setTotalSelectionCount(count)
  }

  const setEmptyListLabel = () => {
    const selectedFacet = filters.find(f => f.isFacetSelected)

    setEmptyFacetValueListLabel(
      !!selectedFacet && displayFacetValues.length === 0
        ? displayListEmptyLabel
        : facetNotSelectedLabel,
    )
  }

  useEffect(countSelections, [filters])

  useEffect(setEmptyListLabel, [displayFacetValues])

  const handleApplyFilters = () => {}

  const handleFacetItemClick = facetType => {
    const facetIndex = filters.findIndex(f => f.type === facetType)

    setFilters(
      filters.map((f, i) => ({ ...f, isFacetSelected: i === facetIndex })),
    )

    setDisplayFacetValues(
      fullFacetOptions.find(f => f.type === facetType).values,
    )

    setSelectedFacetValues(filters[facetIndex].values)
  }

  const handleFacetValueClick = valueId => {
    const facet = filters.find(f => f.isFacetSelected)

    if (facet.values.find(s => s.id === valueId)) {
      facet.values = selectedFacetValues.filter(v => v.id !== valueId)
    } else {
      facet.values = [
        ...facet.values,
        displayFacetValues.find(option => option.id === valueId),
      ]
    }

    setFilters(
      filters.map(f =>
        f.type === facet.type ? { ...f, ...{ values: facet.values } } : f,
      ),
    )

    setSelectedFacetValues(facet.values)
  }

  const handleOnClose = () => {}

  const handleSearchChange = rawSearchValue => {
    const searchValue = rawSearchValue.target.value
    const facetIndex = filters.findIndex(f => f.isFacetSelected)

    if (searchValue === '') {
      setDisplayFacetValues(fullFacetOptions[facetIndex].values)
    } else {
      setDisplayFacetValues(
        fullFacetOptions[facetIndex].values.filter(v =>
          v.value.toLowerCase().includes(searchValue.toLowerCase()),
        ),
      )
    }
  }

  return (
    <FilterFacet
      {...args}
      filterParams={filters}
      onApplyFilters={handleApplyFilters}
      onClose={handleOnClose}
      onEmptyListLabel={emptyFacetValueListLabel}
      onFacetItemClick={handleFacetItemClick}
      onFacetValueClick={handleFacetValueClick}
      onSearchChange={handleSearchChange}
      selectedFacetValues={selectedFacetValues}
      showFooter={!!totalSelectionCount}
      valueOptions={displayFacetValues}
    />
  )
}

export const Base = Template.bind({})

export default {
  component: FilterFacet,
  title: 'Common/FilterFacet',
}
