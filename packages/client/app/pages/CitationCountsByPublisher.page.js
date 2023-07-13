import React, { useEffect, useRef, useState } from 'react'
import { useLazyQuery, useQuery } from '@apollo/client'
import { json2csv } from 'json-2-csv'
import { cloneDeep } from 'lodash'

import { CitationCountsByPublisher, VisuallyHiddenElement } from '../ui'

import { GET_BY_PUBLISHER, GET_FULL_FACET_OPTIONS } from '../graphql'

const facetNotSelectedLabel = 'Please select a facet'
const displayListEmptyLabel = 'No matches found'

const downloadFile = (inputData, fileName, type = 'csv') => {
  const url =
    type === 'csv'
      ? window.URL.createObjectURL(new Blob([inputData]))
      : inputData

  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', fileName)

  document.body.appendChild(link)

  link.click()

  link.parentNode.removeChild(link)
}

const addKeytoData = sourceData => {
  return sourceData.map(s => {
    return { ...s, key: s.id }
  })
}

const compareArrays = (a, b) => {
  return (
    a.length === b.length && a.every((element, index) => element === b[index])
  )
}

const byPublisherTableColumns = [
  {
    title: 'Publisher',
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

const byPublisherFilterParams = [
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
]

const byPublisherDefaultTab = 'chart'

const CitationCountsByPublisherPage = () => {
  const [fullFacetOptions, setFullFacetOptions] = useState([])

  const [byPublisherSelectedTab, setByPublisherSelectedTab] = useState(
    byPublisherDefaultTab,
  )

  const [byPublisherFilters, setByPublisherFilters] = useState(
    byPublisherFilterParams,
  )

  const [byPublisherDisplayFacetValues, setByPublisherDisplayFacetValues] =
    useState([])

  const [byPublisherSelectedFacetCount, setByPublisherSelectedFacetCount] =
    useState(0)

  const [byPublisherSelectedFacetValues, setByPublisherSelectedFacetValues] =
    useState([])

  const [byPublisherShowApplyFilter, setByPublisherShowApplyFilter] =
    useState(false)

  const [byPublisherShowClearFilter, setByPublisherShowClearFilter] =
    useState(false)

  const [byPublisherVisualisationData, setByPublisherVisualisationData] =
    useState([])

  const [byPublisherOtherCount, setByPublisherOtherCount] = useState(0)

  const [byPublisherIsFilterOpen, setByPublisherIsFilterOpen] = useState(false)

  const [byPublisherIsDownloadListOpen, setByPublisherIsDownloadListOpen] =
    useState(false)

  const [
    byPublisherEmptyFacetValueListLabel,
    setByPublisherEmptyFacetValueListLabel,
  ] = useState(facetNotSelectedLabel)

  const byPublisherNewView = useRef(null)

  const setByPublisherEmptyListLabel = () => {
    const selectedFacet = byPublisherFilters.find(f => f.isFacetSelected)

    setByPublisherEmptyFacetValueListLabel(
      !!selectedFacet && byPublisherDisplayFacetValues.length === 0
        ? displayListEmptyLabel
        : facetNotSelectedLabel,
    )
  }

  const { loading: fullFacetOptionsLoading } = useQuery(
    GET_FULL_FACET_OPTIONS,
    {
      onCompleted: data => {
        const options = []

        options.push({ type: 'affiliation', values: data.getAffiliations })
        options.push({ type: 'funder', values: data.getFunders })
        options.push({ type: 'subject', values: data.getSubjects })
        options.push({ type: 'publisher', values: data.getPublishers })
        options.push({ type: 'repository', values: data.getRepositories })
        options.push({ type: 'journal', values: data.getJournals })

        setFullFacetOptions(options)
      },
    },
  )

  useEffect(() => {
    const storedFilters = JSON.parse(localStorage.getItem('byPublisherFilters'))

    const parsedFilters =
      storedFilters?.map(f => ({
        ...f,
        isFacetSelected: false,
      })) || []

    if (storedFilters) {
      setByPublisherFilters(parsedFilters)

      let shouldShowClearButton = false
      let selectionCount = 0

      storedFilters.forEach(s => {
        if (s.values.length) {
          shouldShowClearButton = true
          selectionCount += 1
        }
      })

      setByPublisherSelectedFacetCount(selectionCount)
      setByPublisherShowClearFilter(shouldShowClearButton)
    } else {
      localStorage.setItem(
        'byPublisherFilters',
        JSON.stringify(byPublisherFilters),
      )
    }

    const byPublisherParams = storedFilters
      ? parsedFilters
          .map(f => ({
            field: `${f.type}Id`,
            operator: { in: f.values.map(s => s.id) },
          }))
          .filter(v => !!v.operator.in.length)
      : []

    byPublisherQuery({
      variables: { input: { search: { criteria: byPublisherParams } } },
    })

    return () => {
      localStorage.removeItem('byPublisherFilters')
    }
  }, [])

  useEffect(setByPublisherEmptyListLabel, [byPublisherDisplayFacetValues])

  const [byPublisherQuery, { loading: byPublisherDataLoading }] = useLazyQuery(
    GET_BY_PUBLISHER,
    {
      variables: {
        input: {
          search: {
            criteria: [],
          },
        },
      },
      onCompleted: data => {
        const getAssertionsPerPublisher = cloneDeep(
          data.getAssertionsPerPublisher,
        )
          .filter(d => d.xField !== 'others')
          .map(s => ({
            ...s,
            yField: parseInt(s.yField, 10),
          }))

        const otherData = data.getAssertionsPerPublisher.find(
          d => d.xField === 'others',
        )

        setByPublisherOtherCount(parseInt(otherData.yField, 10))

        setByPublisherVisualisationData(getAssertionsPerPublisher)
      },
    },
  )

  const handleByPublisherFooterTabClick = tabTitle => {
    if (tabTitle === 'download') {
      setByPublisherIsDownloadListOpen(!byPublisherIsDownloadListOpen)
    } else {
      setByPublisherSelectedTab(tabTitle)
    }
  }

  const handleByPublisherApplyFilters = () => {
    setByPublisherIsFilterOpen(false)

    const filters = byPublisherFilters.map(f => ({
      ...f,
      isFacetSelected: false,
    }))

    localStorage.setItem('byPublisherFilters', JSON.stringify(filters))

    let selectionCount = 0

    filters.forEach(s => {
      if (s.values.length) {
        selectionCount += 1
      }
    })

    setByPublisherSelectedFacetCount(selectionCount)
    setByPublisherShowApplyFilter(false)
    setByPublisherDisplayFacetValues([])

    const params = byPublisherFilters
      .map(f => ({
        field: `${f.type}Id`,
        operator: { in: f.values.map(s => s.id) },
      }))
      .filter(v => !!v.operator.in.length)

    byPublisherQuery({
      variables: { input: { search: { criteria: params } } },
    })
  }

  const handleByPublisherClearFilters = () => {
    setByPublisherIsFilterOpen(false)
    setByPublisherShowClearFilter(false)
    setByPublisherShowApplyFilter(false)
    setByPublisherSelectedFacetCount(0)
    localStorage.setItem(
      'byPublisherFilters',
      JSON.stringify(byPublisherFilterParams),
    )
    byPublisherQuery({
      variables: { input: { search: { criteria: [] } } },
    })
  }

  const handleByPublisherFacetItemClick = facetType => {
    const facetIndex = byPublisherFilters.findIndex(f => f.type === facetType)

    setByPublisherFilters(
      byPublisherFilters.map((f, i) => ({
        ...f,
        isFacetSelected: i === facetIndex,
      })),
    )

    setByPublisherDisplayFacetValues(
      fullFacetOptions.find(f => f.type === facetType).values,
    )

    setByPublisherSelectedFacetValues(byPublisherFilters[facetIndex].values)
  }

  const handleByPublisherFacetValueClick = valueId => {
    const facet = byPublisherFilters.find(f => f.isFacetSelected)

    if (facet.values.find(s => s.id === valueId)) {
      facet.values = byPublisherSelectedFacetValues.filter(
        v => v.id !== valueId,
      )
    } else {
      facet.values = [
        ...facet.values,
        byPublisherDisplayFacetValues.find(option => option.id === valueId),
      ]
    }

    setByPublisherFilters(
      byPublisherFilters.map(f =>
        f.type === facet.type ? { ...f, ...{ values: facet.values } } : f,
      ),
    )

    setByPublisherSelectedFacetValues(facet.values)

    const storedFilters = JSON.parse(localStorage.getItem('byPublisherFilters'))
    let shouldShowApplyButton = false
    let shouldShowClearButton = false

    storedFilters.forEach(storedFacet => {
      const currentFacet = byPublisherFilters.find(
        f => f.type === storedFacet.type,
      )

      if (storedFacet.values.length) {
        shouldShowClearButton = true
      }

      if (compareArrays(currentFacet.values, storedFacet.values)) {
        shouldShowApplyButton = true
      }
    })

    setByPublisherShowApplyFilter(shouldShowApplyButton)
    setByPublisherShowClearFilter(shouldShowClearButton)
  }

  const handleByPublisherOnClose = () => {
    setByPublisherIsFilterOpen(false)
    const storedFilters = JSON.parse(localStorage.getItem('byPublisherFilters'))

    if (byPublisherIsFilterOpen) {
      setByPublisherFilters(storedFilters)
    }

    setByPublisherDisplayFacetValues([])
  }

  const handleByPublisherFilterButtonClick = isOpen => {
    if (isOpen) {
      const storedFilters = JSON.parse(
        localStorage.getItem('byPublisherFilters'),
      )

      let shouldShowClearButton = false

      storedFilters.forEach(s => {
        if (s.values.length) {
          shouldShowClearButton = true
        }
      })

      setByPublisherShowClearFilter(shouldShowClearButton)
      setByPublisherFilters(storedFilters)
    }

    setByPublisherDisplayFacetValues([])
    setByPublisherShowApplyFilter(false)
    setByPublisherIsFilterOpen(isOpen)
  }

  const handleByPublisherSearchChange = rawSearchValue => {
    const searchValue = rawSearchValue.target.value
    const facetType = byPublisherFilters.find(f => f.isFacetSelected).type

    const targetFacet = fullFacetOptions.find(f => f.type === facetType)

    if (searchValue === '') {
      setByPublisherDisplayFacetValues(targetFacet.values)
    } else {
      setByPublisherDisplayFacetValues(
        targetFacet.values.filter(v =>
          v.title.toLowerCase().includes(searchValue.toLowerCase()),
        ),
      )
    }
  }

  const handleByPublisherDownloadOptionClick = async type => {
    setByPublisherIsDownloadListOpen(false)

    if (type === 'csv') {
      const csvString = await json2csv(
        addKeytoData(byPublisherVisualisationData),
        {
          keys: [
            { field: 'xField', title: 'Publisher' },
            { field: 'yField', title: 'Total Citations' },
          ],
        },
      )

      downloadFile(csvString, 'Citation counts by publisher.csv')
    } else if (type === 'png' || type === 'svg') {
      const imgString = await byPublisherNewView.current.toImageURL(
        type,
        type === 'png' ? 4 : 2,
      )

      downloadFile(imgString, `Citation counts by publisher.${type}`, type)
    }
  }

  const handleByPublisherOnNewView = view => {
    byPublisherNewView.current = view
  }

  return (
    <>
      <VisuallyHiddenElement as="h1">
        Citation counts by publisher page
      </VisuallyHiddenElement>
      <CitationCountsByPublisher
        data={
          byPublisherSelectedTab === 'chart'
            ? byPublisherVisualisationData
            : addKeytoData(byPublisherVisualisationData)
        }
        filterParams={byPublisherFilters}
        filterValueOptions={byPublisherDisplayFacetValues}
        isDownloadListOpen={byPublisherIsDownloadListOpen}
        isFilterOpen={byPublisherIsFilterOpen}
        loading={byPublisherDataLoading || fullFacetOptionsLoading}
        onApplyFilters={handleByPublisherApplyFilters}
        onClearFilters={handleByPublisherClearFilters}
        onDownloadOptionClick={handleByPublisherDownloadOptionClick}
        onEmptyListLabel={byPublisherEmptyFacetValueListLabel}
        onFacetItemClick={handleByPublisherFacetItemClick}
        onFacetValueClick={handleByPublisherFacetValueClick}
        onFilterClick={handleByPublisherFilterButtonClick}
        onFilterClose={handleByPublisherOnClose}
        onFilterSearchChange={handleByPublisherSearchChange}
        onFooterTabClick={handleByPublisherFooterTabClick}
        onNewView={handleByPublisherOnNewView}
        otherCount={byPublisherOtherCount}
        selectedFacetCount={byPublisherSelectedFacetCount}
        selectedFacetValues={byPublisherSelectedFacetValues}
        selectedFooterTab={byPublisherSelectedTab}
        showApplyFilterButton={byPublisherShowApplyFilter}
        showClearFilterButton={byPublisherShowClearFilter}
        tableColumns={byPublisherTableColumns}
      />
      <VisuallyHiddenElement
        aria-live="polite"
        as="div"
        id="search-results-update"
        role="status"
      />
    </>
  )
}

export default CitationCountsByPublisherPage
