import React, { useState, useEffect } from 'react'
import { lorem } from 'faker'
import { uuid } from '@coko/client'

import { CitationCountsBySubject } from '../../app/ui'

const parentId = uuid()

const randomNumber = ceiling => {
  return Math.floor(Math.random() * ceiling)
}

const data = [
  { id: parentId, xField: '', yField: 0, parent: null, tooltip: [{}] },
  {
    id: uuid(),
    xField: 'Subject 0',
    yField: randomNumber(1000),
    parent: parentId,
    tooltip: [{}],
  },
  {
    id: uuid(),
    xField: 'Subject 1',
    yField: randomNumber(1000),
    parent: parentId,
    tooltip: [{}],
  },
  {
    id: uuid(),
    xField: 'Subject 2',
    yField: randomNumber(1000),
    parent: parentId,
    tooltip: [{}],
  },
  {
    id: uuid(),
    xField: 'Subject 3',
    yField: randomNumber(1000),
    parent: parentId,
    tooltip: [{}],
  },
  {
    id: uuid(),
    xField: 'Subject 4',
    yField: randomNumber(1000),
    parent: parentId,
    tooltip: [{}],
  },
  {
    id: uuid(),
    xField: 'Subject 5',
    yField: randomNumber(1000),
    parent: parentId,
    tooltip: [{}],
  },
  {
    id: uuid(),
    xField: 'Subject 6',
    yField: randomNumber(1000),
    parent: parentId,
    tooltip: [{}],
  },
  {
    id: uuid(),
    xField: 'Subject 7',
    yField: randomNumber(1000),
    parent: parentId,
    tooltip: [{}],
  },
  {
    id: uuid(),
    xField: 'Subject 8',
    yField: randomNumber(1000),
    parent: parentId,
    tooltip: [{}],
  },
  {
    id: uuid(),
    xField: 'Subject 9',
    yField: randomNumber(1000),
    parent: parentId,
    tooltip: [{}],
  },
  {
    id: uuid(),
    xField: 'Subject 10',
    yField: randomNumber(1000),
    parent: parentId,
    tooltip: [{}],
  },
  {
    id: uuid(),
    xField: 'Subject 11',
    yField: randomNumber(1000),
    parent: parentId,
    tooltip: [{}],
  },
  {
    id: uuid(),
    xField: 'Subject 12',
    yField: randomNumber(1000),
    parent: parentId,
    tooltip: [{}],
  },
  {
    id: uuid(),
    xField: 'Subject 13',
    yField: randomNumber(1000),
    parent: parentId,
    tooltip: [{}],
  },
  {
    id: uuid(),
    xField: 'Subject 14',
    yField: randomNumber(1000),
    parent: parentId,
    tooltip: [{}],
  },
  {
    id: uuid(),
    xField: 'Subject 15',
    yField: randomNumber(1000),
    parent: parentId,
    tooltip: [{}],
  },
  {
    id: uuid(),
    xField: 'Subject 16',
    yField: randomNumber(1000),
    parent: parentId,
    tooltip: [{}],
  },
  {
    id: uuid(),
    xField: 'Subject 17',
    yField: randomNumber(1000),
    parent: parentId,
    tooltip: [{}],
  },
  {
    id: uuid(),
    xField: 'Subject 18',
    yField: randomNumber(1000),
    parent: parentId,
    tooltip: [{}],
  },
  {
    id: uuid(),
    xField: 'Subject 19',
    yField: randomNumber(1000),
    parent: parentId,
    tooltip: [{}],
  },
]

const columns = [
  //   {
  //     title: 'Year',
  //     dataIndex: 'year',
  //     key: 'year',
  //   },
  {
    title: 'Subject',
    dataIndex: 'xField',
    key: 'xField',
  },
  {
    title: 'Total Citations',
    dataIndex: 'yField',
    key: 'yField',
    render: value => value?.toLocaleString('en-US') || 0,
  },
]

// const groupBy = (xs, key) => {
//   return xs.reduce((rv, x) => {
//     // eslint-disable-next-line no-param-reassign
//     ;(rv[x[key]] = rv[x[key]] || []).push(x)
//     return rv
//   }, {})
// }

// const transformData = (sourceData, transformBy, keyField, valueField) => {
//   const result = []

//   const groupedData = groupBy(sourceData, transformBy)

//   Object.entries(groupedData).forEach(([groupedKey, groupedValue]) => {
//     const workingObject = {}
//     let total = 0
//     workingObject[transformBy] = groupedKey

//     groupedValue.forEach(transformedRaw => {
//       const key = transformedRaw[keyField]
//       workingObject[key] = transformedRaw[valueField]
//       total += transformedRaw[valueField]
//     })

//     workingObject.total = total
//     workingObject.key = groupedKey

//     result.push(workingObject)
//   })

//   return result
// }

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
        value: `DataCite Event Data`,
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

const defaultTab = 'chart'

const Template = args => {
  const [selectedTab, setSelectedTab] = useState(defaultTab)
  const [filters, setFilters] = useState(filterParams)
  const [displayFacetValues, setDisplayFacetValues] = useState([])
  const [selectedFacetValues, setSelectedFacetValues] = useState([])
  const [totalSelectionCount, setTotalSelectionCount] = useState(0)
  //   const [visualisationData, setVisualisationData] = useState(data)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isDowloadListOpen, setIsDownloadListOpen] = useState(false)

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

  const handleFooterTabClick = tabTitle => {
    if (tabTitle === 'download') {
      setIsDownloadListOpen(!isDowloadListOpen)
    } else {
      setSelectedTab(tabTitle)
    }
  }

  const handleApplyFilters = () => {
    setIsFilterOpen(false)
  }

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

  const handleOnClose = () => {
    setIsFilterOpen(false)
  }

  const handleFilterButtonClick = isOpen => {
    setIsFilterOpen(isOpen)
  }

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

  const handleDownloadOptionClick = () => {}

  const handleNewView = () => {}

  const transformData = sourceData => {
    return sourceData
      .map(s => {
        return { ...s, key: s.id }
      })
      .filter(f => f.id !== parentId)
  }

  return (
    <CitationCountsBySubject
      {...args}
      data={selectedTab === 'chart' ? data : transformData(data)}
      filterParams={filters}
      filterValueOptions={displayFacetValues}
      isDownloadListOpen={isDowloadListOpen}
      isFilterOpen={isFilterOpen}
      onApplyFilters={handleApplyFilters}
      onDownloadOptionClick={handleDownloadOptionClick}
      onEmptyListLabel={emptyFacetValueListLabel}
      onFacetItemClick={handleFacetItemClick}
      onFacetValueClick={handleFacetValueClick}
      onFilterClick={handleFilterButtonClick}
      onFilterClose={handleOnClose}
      onFilterSearchChange={handleSearchChange}
      onFooterTabClick={handleFooterTabClick}
      onNewView={handleNewView}
      selectedFacetValues={selectedFacetValues}
      selectedFooterTab={selectedTab}
      showApplyFilterButton={!!totalSelectionCount}
      tableColumns={columns}
    />
  )
}

export const Base = Template.bind({})

export default {
  component: CitationCountsBySubject,
  title: 'Visualisation/CitationCountsBySubject',
}
