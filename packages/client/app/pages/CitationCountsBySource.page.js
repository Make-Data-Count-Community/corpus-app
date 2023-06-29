import React, { useEffect, useRef, useState } from 'react'
import { useLazyQuery, useQuery } from '@apollo/client'
import { json2csv } from 'json-2-csv'
import { cloneDeep } from 'lodash'

import { CitationCountsBySource, VisuallyHiddenElement } from '../ui'

import { GET_BY_SOURCE, GET_FULL_FACET_OPTIONS } from '../graphql'

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

const groupBy = (xs, key) => {
  return xs.reduce((rv, x) => {
    // eslint-disable-next-line no-param-reassign
    ;(rv[x[key]] = rv[x[key]] || []).push(x)
    return rv
  }, {})
}

const transformChartData = (sourceData, transformBy, keyField, valueField) => {
  const result = []

  const groupedData = groupBy(sourceData, transformBy)

  Object.entries(groupedData).forEach(([groupedKey, groupedValue]) => {
    const workingObject = {}
    let total = 0
    workingObject[transformBy] = groupedKey

    groupedValue.forEach(transformedRaw => {
      const key = transformedRaw[keyField]
      workingObject[key] = parseInt(transformedRaw[valueField], 10)
      total += parseInt(transformedRaw[valueField], 10)
    })

    workingObject.total = total
    workingObject.key = groupedKey

    result.push(workingObject)
  })

  return result
}

const compareArrays = (a, b) => {
  return (
    a.length === b.length && a.every((element, index) => element === b[index])
  )
}

const bySourceTableColumns = [
  {
    title: 'Source',
    dataIndex: 'xField',
    key: 'xField',
  },
  {
    title: 'DOI',
    dataIndex: 'DOI',
    key: 'doi',
    render: value => value?.toLocaleString('en-US') || 0,
  },
  {
    title: 'Accession Number',
    dataIndex: 'Accession Number',
    key: 'accession',
    render: value => value?.toLocaleString('en-US') || 0,
  },
  {
    title: 'Total Citations',
    dataIndex: 'total',
    key: 'total',
    render: value => value?.toLocaleString('en-US') || 0,
  },
]

const bySourceFilterParams = [
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

const bySourceDefaultTab = 'chart'

const CitationCountsBySourcePage = () => {
  const [fullFacetOptions, setFullFacetOptions] = useState([])

  const [bySourceSelectedTab, setBySourceSelectedTab] =
    useState(bySourceDefaultTab)

  const [bySourceFilters, setBySourceFilters] = useState(bySourceFilterParams)

  const [bySourceDisplayFacetValues, setBySourceDisplayFacetValues] = useState(
    [],
  )

  const [bySourceSelectedFacetCount, setBySourceSelectedFacetCount] =
    useState(0)

  const [bySourceSelectedFacetValues, setBySourceSelectedFacetValues] =
    useState([])

  const [bySourceShowApplyFilter, setBySourceShowApplyFilter] = useState(false)

  const [bySourceShowClearFilter, setBySourceShowClearFilter] = useState(false)

  const [bySourceVisualisationData, setBySourceVisualisationData] = useState([])

  const [bySourceIsFilterOpen, setBySourceIsFilterOpen] = useState(false)

  const [bySourceIsDownloadListOpen, setBySourceIsDownloadListOpen] =
    useState(false)

  const [
    bySourceEmptyFacetValueListLabel,
    setBySourceEmptyFacetValueListLabel,
  ] = useState(facetNotSelectedLabel)

  const bySourceNewView = useRef(null)

  const setBySourceEmptyListLabel = () => {
    const selectedFacet = bySourceFilters.find(f => f.isFacetSelected)

    setBySourceEmptyFacetValueListLabel(
      !!selectedFacet && bySourceDisplayFacetValues.length === 0
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

  const [bySourceQuery, { loading: bySourceDataLoading }] = useLazyQuery(
    GET_BY_SOURCE,
    {
      variables: {
        input: {
          search: {
            criteria: [],
          },
        },
      },
      onCompleted: data => {
        const getAssertionCountsPerSource = cloneDeep(
          data.getAssertionCountsPerSource,
        )

        setBySourceVisualisationData(getAssertionCountsPerSource)
      },
    },
  )

  useEffect(() => {
    const storedFilters = JSON.parse(localStorage.getItem('bySourceFilters'))

    const parsedFilters =
      storedFilters?.map(f => ({
        ...f,
        isFacetSelected: false,
      })) || []

    if (storedFilters) {
      setBySourceFilters(parsedFilters)

      let shouldShowClearButton = false
      let selectionCount = 0

      storedFilters.forEach(s => {
        if (s.values.length) {
          shouldShowClearButton = true
          selectionCount += 1
        }
      })

      setBySourceSelectedFacetCount(selectionCount)
      setBySourceShowClearFilter(shouldShowClearButton)
    } else {
      localStorage.setItem('bySourceFilters', JSON.stringify(bySourceFilters))
    }

    const bySourceParams = storedFilters
      ? parsedFilters
          .map(f => ({
            field: `${f.type}Id`,
            operator: { in: f.values.map(s => s.id) },
          }))
          .filter(v => !!v.operator.in.length)
      : []

    bySourceQuery({
      variables: { input: { search: { criteria: bySourceParams } } },
    })

    return () => {
      localStorage.removeItem('bySourceFilters')
    }
  }, [])

  useEffect(setBySourceEmptyListLabel, [bySourceDisplayFacetValues])

  const handleBySourceFooterTabClick = tabTitle => {
    if (tabTitle === 'download') {
      setBySourceIsDownloadListOpen(!bySourceIsDownloadListOpen)
    } else {
      setBySourceSelectedTab(tabTitle)
    }
  }

  const handleBySourceApplyFilters = () => {
    setBySourceIsFilterOpen(false)

    const filters = bySourceFilters.map(f => ({
      ...f,
      isFacetSelected: false,
    }))

    localStorage.setItem('bySourceFilters', JSON.stringify(filters))

    let selectionCount = 0

    filters.forEach(s => {
      if (s.values.length) {
        selectionCount += 1
      }
    })

    setBySourceSelectedFacetCount(selectionCount)

    setBySourceShowApplyFilter(false)
    setBySourceDisplayFacetValues([])

    const params = bySourceFilters
      .map(f => ({
        field: `${f.type}Id`,
        operator: { in: f.values.map(s => s.id) },
      }))
      .filter(v => !!v.operator.in.length)

    bySourceQuery({
      variables: { input: { search: { criteria: params } } },
    })
  }

  const handleBySourceClearFilters = () => {
    setBySourceIsFilterOpen(false)
    setBySourceShowClearFilter(false)
    setBySourceShowApplyFilter(false)
    setBySourceSelectedFacetCount(0)
    localStorage.setItem(
      'bySourceFilters',
      JSON.stringify(bySourceFilterParams),
    )
    bySourceQuery({
      variables: { input: { search: { criteria: [] } } },
    })
  }

  const handleBySourceFacetItemClick = facetType => {
    const facetIndex = bySourceFilters.findIndex(f => f.type === facetType)

    setBySourceFilters(
      bySourceFilters.map((f, i) => ({
        ...f,
        isFacetSelected: i === facetIndex,
      })),
    )

    setBySourceDisplayFacetValues(
      fullFacetOptions.find(f => f.type === facetType).values,
    )

    setBySourceSelectedFacetValues(bySourceFilters[facetIndex].values)
  }

  const handleBySourceFacetValueClick = valueId => {
    const facet = bySourceFilters.find(f => f.isFacetSelected)

    if (facet.values.find(s => s.id === valueId)) {
      facet.values = bySourceSelectedFacetValues.filter(v => v.id !== valueId)
    } else {
      facet.values = [
        ...facet.values,
        bySourceDisplayFacetValues.find(option => option.id === valueId),
      ]
    }

    setBySourceFilters(
      bySourceFilters.map(f =>
        f.type === facet.type ? { ...f, ...{ values: facet.values } } : f,
      ),
    )

    setBySourceSelectedFacetValues(facet.values)

    const storedFilters = JSON.parse(localStorage.getItem('bySourceFilters'))
    let shouldShowApplyButton = false
    let shouldShowClearButton = false

    storedFilters.forEach(storedFacet => {
      const currentFacet = bySourceFilters.find(
        f => f.type === storedFacet.type,
      )

      if (storedFacet.values.length) {
        shouldShowClearButton = true
      }

      if (compareArrays(currentFacet.values, storedFacet.values)) {
        shouldShowApplyButton = true
      }
    })

    setBySourceShowApplyFilter(shouldShowApplyButton)
    setBySourceShowClearFilter(shouldShowClearButton)
  }

  const handleBySourceOnClose = () => {
    setBySourceIsFilterOpen(false)
    const storedFilters = JSON.parse(localStorage.getItem('bySourceFilters'))

    if (bySourceIsFilterOpen) {
      setBySourceFilters(storedFilters)
    }

    setBySourceDisplayFacetValues([])
  }

  const handleBySourceFilterButtonClick = isOpen => {
    if (isOpen) {
      const storedFilters = JSON.parse(localStorage.getItem('bySourceFilters'))

      let shouldShowClearButton = false

      storedFilters.forEach(s => {
        if (s.values.length) {
          shouldShowClearButton = true
        }
      })

      setBySourceShowClearFilter(shouldShowClearButton)
      setBySourceFilters(storedFilters)
    }

    setBySourceDisplayFacetValues([])
    setBySourceShowApplyFilter(false)
    setBySourceIsFilterOpen(isOpen)
  }

  const handleBySourceSearchChange = rawSearchValue => {
    const searchValue = rawSearchValue.target.value
    const facetType = bySourceFilters.find(f => f.isFacetSelected).type

    const targetFacet = fullFacetOptions.find(f => f.type === facetType)

    if (searchValue === '') {
      setBySourceDisplayFacetValues(targetFacet.values)
    } else {
      setBySourceDisplayFacetValues(
        targetFacet.values.filter(v =>
          v.title.toLowerCase().includes(searchValue.toLowerCase()),
        ),
      )
    }
  }

  const handleBySourceDownloadOptionClick = async type => {
    setBySourceIsDownloadListOpen(false)

    if (type === 'csv') {
      const csvString = await json2csv(
        transformChartData(
          bySourceVisualisationData,
          'xField',
          'stackField',
          'yField',
        ),
        {
          keys: [
            { field: 'xField', title: 'Source' },
            { field: 'DOI', title: 'DOI' },
            { field: 'Accession Number', title: 'Accession Number' },
            { field: 'total', title: 'Total Citations' },
          ],
        },
      )

      downloadFile(csvString, 'Citation counts by source of citation.csv')
    } else if (type === 'png' || type === 'svg') {
      const imgString = await bySourceNewView.current.toImageURL(
        type,
        type === 'png' ? 4 : 2,
      )

      downloadFile(
        imgString,
        `Citation counts by source of citation.${type}`,
        type,
      )
    }
  }

  const handleBySourceOnNewView = view => {
    bySourceNewView.current = view
  }

  return (
    <>
      <VisuallyHiddenElement as="h1">
        Citation counts by source of citation page
      </VisuallyHiddenElement>
      <CitationCountsBySource
        data={
          bySourceSelectedTab === 'chart'
            ? bySourceVisualisationData
            : transformChartData(
                bySourceVisualisationData,
                'xField',
                'stackField',
                'yField',
              )
        }
        filterParams={bySourceFilters}
        filterValueOptions={bySourceDisplayFacetValues}
        isDownloadListOpen={bySourceIsDownloadListOpen}
        isFilterOpen={bySourceIsFilterOpen}
        loading={bySourceDataLoading || fullFacetOptionsLoading}
        onApplyFilters={handleBySourceApplyFilters}
        onClearFilters={handleBySourceClearFilters}
        onDownloadOptionClick={handleBySourceDownloadOptionClick}
        onEmptyListLabel={bySourceEmptyFacetValueListLabel}
        onFacetItemClick={handleBySourceFacetItemClick}
        onFacetValueClick={handleBySourceFacetValueClick}
        onFilterClick={handleBySourceFilterButtonClick}
        onFilterClose={handleBySourceOnClose}
        onFilterSearchChange={handleBySourceSearchChange}
        onFooterTabClick={handleBySourceFooterTabClick}
        onNewView={handleBySourceOnNewView}
        selectedFacetCount={bySourceSelectedFacetCount}
        selectedFacetValues={bySourceSelectedFacetValues}
        selectedFooterTab={bySourceSelectedTab}
        showApplyFilterButton={bySourceShowApplyFilter}
        showClearFilterButton={bySourceShowClearFilter}
        tableColumns={bySourceTableColumns}
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

export default CitationCountsBySourcePage
