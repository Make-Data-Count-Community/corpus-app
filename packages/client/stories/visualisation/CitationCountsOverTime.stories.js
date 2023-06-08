import React, { useState, useEffect } from 'react'

import { CitationCountsOverTime } from '../../app/ui'

const randomNumber = ceiling => {
  return Math.floor(Math.random() * ceiling)
}

const data = [
  { xField: 2010, yField: randomNumber(10000000), stackField: 'DOI' },
  { xField: 2011, yField: randomNumber(10000000), stackField: 'DOI' },
  { xField: 2012, yField: randomNumber(10000000), stackField: 'DOI' },
  { xField: 2013, yField: randomNumber(10000000), stackField: 'DOI' },
  { xField: 2014, yField: randomNumber(10000000), stackField: 'DOI' },
  { xField: 2015, yField: randomNumber(10000000), stackField: 'DOI' },
  { xField: 2016, yField: randomNumber(10000000), stackField: 'DOI' },
  { xField: 2017, yField: randomNumber(10000000), stackField: 'DOI' },
  { xField: 2018, yField: randomNumber(10000000), stackField: 'DOI' },
  { xField: 2019, yField: randomNumber(10000000), stackField: 'DOI' },
  { xField: 2010, yField: randomNumber(10000000), stackField: 'Accession ID' },
  { xField: 2011, yField: randomNumber(10000000), stackField: 'Accession ID' },
  { xField: 2012, yField: randomNumber(10000000), stackField: 'Accession ID' },
  { xField: 2013, yField: randomNumber(10000000), stackField: 'Accession ID' },
  { xField: 2014, yField: randomNumber(10000000), stackField: 'Accession ID' },
  { xField: 2015, yField: randomNumber(10000000), stackField: 'Accession ID' },
  { xField: 2016, yField: randomNumber(10000000), stackField: 'Accession ID' },
  { xField: 2017, yField: randomNumber(10000000), stackField: 'Accession ID' },
  { xField: 2018, yField: randomNumber(10000000), stackField: 'Accession ID' },
  { xField: 2019, yField: randomNumber(10000000), stackField: 'Accession ID' },
]

const columns = [
  {
    title: 'Year',
    dataIndex: 'xField',
    key: 'xField',
  },
  {
    title: 'DOI',
    dataIndex: 'DOI',
    key: 'doi',
    render: value =>
      value?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || 0,
  },
  {
    title: 'Accession ID',
    dataIndex: 'Accession ID',
    key: 'accession',
    render: value =>
      value?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || 0,
  },
  {
    title: 'Total Citations',
    dataIndex: 'total',
    key: 'total',
    render: value =>
      value?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || 0,
  },
]

const groupBy = (xs, key) => {
  return xs.reduce((rv, x) => {
    // eslint-disable-next-line no-param-reassign
    ;(rv[x[key]] = rv[x[key]] || []).push(x)
    return rv
  }, {})
}

const transformData = (sourceData, transformBy, keyField, valueField) => {
  const result = []

  const groupedData = groupBy(sourceData, transformBy)

  Object.entries(groupedData).forEach(([groupedKey, groupedValue]) => {
    const workingObject = {}
    let total = 0
    workingObject[transformBy] = groupedKey

    groupedValue.forEach(transformedRaw => {
      const key = transformedRaw[keyField]
      workingObject[key] = transformedRaw[valueField]
      total += transformedRaw[valueField]
    })

    workingObject.total = total
    workingObject.key = groupedKey

    result.push(workingObject)
  })

  return result
}

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
]

const fullFacetOptions = [
  { type: 'doi', values: [] },
  { type: 'accession', values: [] },
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

  const handleExpandClick = () => {}

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

  return (
    <CitationCountsOverTime
      {...args}
      data={
        selectedTab === 'chart'
          ? data
          : transformData(data, 'xField', 'stackField', 'yField')
      }
      filterParams={filters}
      filterValueOptions={displayFacetValues}
      isDownloadListOpen={isDowloadListOpen}
      isFilterOpen={isFilterOpen}
      onApplyFilters={handleApplyFilters}
      onDownloadOptionClick={handleDownloadOptionClick}
      onEmptyListLabel={emptyFacetValueListLabel}
      onExpandClick={handleExpandClick}
      onFacetItemClick={handleFacetItemClick}
      onFacetValueClick={handleFacetValueClick}
      onFilterClick={handleFilterButtonClick}
      onFilterClose={handleOnClose}
      onFilterSearchChange={handleSearchChange}
      onFooterTabClick={handleFooterTabClick}
      onNewView={handleNewView}
      selectedFacetValues={selectedFacetValues}
      selectedFooterTab={selectedTab}
      showFilterFooter={!!totalSelectionCount}
      tableColumns={columns}
    />
  )
}

export const Base = Template.bind({})

export default {
  component: CitationCountsOverTime,
  title: 'Visualisation/CitationCountsOverTime',
}
