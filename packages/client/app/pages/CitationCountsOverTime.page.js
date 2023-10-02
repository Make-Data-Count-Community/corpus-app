import React, { useEffect, useRef, useState } from 'react'
import { useLazyQuery, useQuery } from '@apollo/client'
import { json2csv } from 'json-2-csv'
import { cloneDeep } from 'lodash'

import { CitationCountsOverTime, VisuallyHiddenElement } from '../ui'

import { GET_BY_YEAR, GET_FULL_FACET_OPTIONS } from '../graphql'

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

const overTimeTableColumns = [
  {
    title: 'Year',
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

const overTimeFilterParams = [
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

const overTimeDefaultTab = 'chart'

const CitationCountsOverTimePage = () => {
  const [fullFacetOptions, setFullFacetOptions] = useState([])

  const [overTimeSelectedTab, setOverTimeSelectedTab] =
    useState(overTimeDefaultTab)

  const [overTimeFilters, setOverTimeFilters] = useState(overTimeFilterParams)

  const [overTimeDisplayFacetValues, setOverTimeDisplayFacetValues] = useState(
    [],
  )

  const [overTimeSelectedFacetCount, setOverTimeSelectedFacetCount] =
    useState(0)

  const [overTimeSelectedFacetValues, setOverTimeSelectedFacetValues] =
    useState([])

  const [overTimeShowApplyFilter, setOverTimeShowApplyFilter] = useState(false)

  const [overTimeShowClearFilter, setOverTimeShowClearFilter] = useState(false)

  const [overTimeVisualisationData, setOverTimeVisualisationData] = useState([])

  const [overTimeIsFilterOpen, setOverTimeIsFilterOpen] = useState(false)

  const [overTimeIsDownloadListOpen, setOverTimeIsDownloadListOpen] =
    useState(false)

  const [
    overTimeEmptyFacetValueListLabel,
    setOverTimeEmptyFacetValueListLabel,
  ] = useState(facetNotSelectedLabel)

  const overTimeNewView = useRef(null)

  const setOverTimeEmptyListLabel = () => {
    const selectedFacet = overTimeFilters.find(f => f.isFacetSelected)

    setOverTimeEmptyFacetValueListLabel(
      !!selectedFacet && overTimeDisplayFacetValues.length === 0
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

  const [byYearQuery, { loading: byYearDataLoading }] = useLazyQuery(
    GET_BY_YEAR,
    {
      variables: {
        input: {
          search: {
            criteria: [],
          },
        },
      },
      onCompleted: data => {
        const getAssertionsPerYear = cloneDeep(data.getAssertionsPerYear)
        setOverTimeVisualisationData(getAssertionsPerYear)
      },
    },
  )

  useEffect(() => {
    const storedFilters = JSON.parse(localStorage.getItem('overTimeFilters'))

    const parsedFilters =
      storedFilters?.map(f => ({
        ...f,
        isFacetSelected: false,
      })) || []

    if (storedFilters) {
      setOverTimeFilters(parsedFilters)

      let shouldShowClearButton = false
      let selectionCount = 0

      storedFilters.forEach(s => {
        if (s.values.length) {
          shouldShowClearButton = true
          selectionCount += 1
        }
      })

      setOverTimeSelectedFacetCount(selectionCount)
      setOverTimeShowClearFilter(shouldShowClearButton)
    } else {
      localStorage.setItem('overTimeFilters', JSON.stringify(overTimeFilters))
    }

    const overTimeParams = storedFilters
      ? parsedFilters
          .map(f => ({
            field: `${f.type}Id`,
            operator: { in: f.values.map(s => s.id) },
          }))
          .filter(v => !!v.operator.in.length)
      : []

    byYearQuery({
      variables: { input: { search: { criteria: overTimeParams } } },
    })

    return () => {
      localStorage.removeItem('overTimeFilters')
    }
  }, [])

  useEffect(setOverTimeEmptyListLabel, [overTimeDisplayFacetValues])

  const handleOverTimeFooterTabClick = tabTitle => {
    if (tabTitle === 'download') {
      setOverTimeIsDownloadListOpen(!overTimeIsDownloadListOpen)
    } else {
      setOverTimeSelectedTab(tabTitle)
    }
  }

  const handleOverTimeApplyFilters = () => {
    setOverTimeIsFilterOpen(false)

    const filters = overTimeFilters.map(f => ({ ...f, isFacetSelected: false }))

    localStorage.setItem('overTimeFilters', JSON.stringify(filters))

    let selectionCount = 0

    filters.forEach(s => {
      if (s.values.length) {
        selectionCount += 1
      }
    })

    setOverTimeSelectedFacetCount(selectionCount)

    setOverTimeShowApplyFilter(false)
    setOverTimeDisplayFacetValues([])

    const params = overTimeFilters
      .map(f => ({
        field: `${f.type}Id`,
        operator: { in: f.values.map(s => s.id) },
      }))
      .filter(v => !!v.operator.in.length)

    byYearQuery({
      variables: { input: { search: { criteria: params } } },
    })
  }

  const handleOverTimeClearFilters = () => {
    setOverTimeIsFilterOpen(false)
    setOverTimeShowClearFilter(false)
    setOverTimeShowApplyFilter(false)
    setOverTimeSelectedFacetCount(0)
    localStorage.setItem(
      'overTimeFilters',
      JSON.stringify(overTimeFilterParams),
    )
    byYearQuery({
      variables: { input: { search: { criteria: [] } } },
    })
  }

  const handleOverTimeFacetItemClick = facetType => {
    const facetIndex = overTimeFilters.findIndex(f => f.type === facetType)

    setOverTimeFilters(
      overTimeFilters.map((f, i) => ({
        ...f,
        isFacetSelected: i === facetIndex,
      })),
    )

    setOverTimeDisplayFacetValues(
      fullFacetOptions.find(f => f.type === facetType).values,
    )

    setOverTimeSelectedFacetValues(overTimeFilters[facetIndex].values)
  }

  const handleOverTimeFacetValueClick = valueId => {
    const facet = overTimeFilters.find(f => f.isFacetSelected)

    if (facet.values.find(s => s.id === valueId)) {
      facet.values = overTimeSelectedFacetValues.filter(v => v.id !== valueId)
    } else {
      facet.values = [
        ...facet.values,
        overTimeDisplayFacetValues.find(option => option.id === valueId),
      ]
    }

    setOverTimeFilters(
      overTimeFilters.map(f =>
        f.type === facet.type ? { ...f, ...{ values: facet.values } } : f,
      ),
    )

    setOverTimeSelectedFacetValues(facet.values)

    const storedFilters = JSON.parse(localStorage.getItem('overTimeFilters'))
    let shouldShowApplyButton = false
    let shouldShowClearButton = false

    storedFilters.forEach(storedFacet => {
      const currentFacet = overTimeFilters.find(
        f => f.type === storedFacet.type,
      )

      if (storedFacet.values.length) {
        shouldShowClearButton = true
      }

      if (compareArrays(currentFacet.values, storedFacet.values)) {
        shouldShowApplyButton = true
      }
    })

    setOverTimeShowApplyFilter(shouldShowApplyButton)
    setOverTimeShowClearFilter(shouldShowClearButton)
  }

  const handleOverTimeOnClose = () => {
    setOverTimeIsFilterOpen(false)
    const storedFilters = JSON.parse(localStorage.getItem('overTimeFilters'))

    if (overTimeIsFilterOpen) {
      setOverTimeFilters(storedFilters)
    }

    setOverTimeDisplayFacetValues([])
  }

  const handleOverTimeFilterButtonClick = isOpen => {
    if (isOpen) {
      const storedFilters = JSON.parse(localStorage.getItem('overTimeFilters'))

      let shouldShowClearButton = false

      storedFilters.forEach(s => {
        if (s.values.length) {
          shouldShowClearButton = true
        }
      })

      setOverTimeShowClearFilter(shouldShowClearButton)
      setOverTimeFilters(storedFilters)
    }

    setOverTimeDisplayFacetValues([])
    setOverTimeShowApplyFilter(false)
    setOverTimeIsFilterOpen(isOpen)
  }

  const handleOverTimeSearchChange = rawSearchValue => {
    const searchValue = rawSearchValue.target.value
    const facetType = overTimeFilters.find(f => f.isFacetSelected).type

    const targetFacet = fullFacetOptions.find(f => f.type === facetType)

    if (searchValue === '') {
      setOverTimeDisplayFacetValues(targetFacet.values)
    } else {
      setOverTimeDisplayFacetValues(
        targetFacet.values.filter(v =>
          v.title.toLowerCase().includes(searchValue.toLowerCase()),
        ),
      )
    }
  }

  const handleOverTimeDownloadOptionClick = async type => {
    setOverTimeIsDownloadListOpen(false)

    if (type === 'csv') {
      const csvString = await json2csv(
        addKeytoData(
          transformChartData(
            overTimeVisualisationData,
            'xField',
            'stackField',
            'yField',
          ),
        ),
        {
          keys: [
            { field: 'xField', title: 'Year' },
            { field: 'DOI', title: 'DOI' },
            { field: 'Accession Number', title: 'Accession Number' },
            { field: 'total', title: 'Total Citations' },
          ],
        },
      )

      downloadFile(csvString, 'Citation counts over time.csv')
    } else if (type === 'png' || type === 'svg') {
      const imgString = await overTimeNewView.current.toImageURL(
        type,
        type === 'png' ? 4 : 2,
      )

      downloadFile(imgString, `Citation counts over time.${type}`, type)
    }
  }

  const handleOverTimeOnNewView = view => {
    overTimeNewView.current = view
  }

  return (
    <>
      <VisuallyHiddenElement as="h1">
        Citation counts over time page
      </VisuallyHiddenElement>
      <CitationCountsOverTime
        data={
          overTimeSelectedTab === 'chart'
            ? overTimeVisualisationData
            : transformChartData(
                overTimeVisualisationData,
                'xField',
                'stackField',
                'yField',
              )
        }
        filterParams={overTimeFilters}
        filterValueOptions={overTimeDisplayFacetValues}
        isDownloadListOpen={overTimeIsDownloadListOpen}
        isFilterOpen={overTimeIsFilterOpen}
        loading={byYearDataLoading || fullFacetOptionsLoading}
        onApplyFilters={handleOverTimeApplyFilters}
        onClearFilters={handleOverTimeClearFilters}
        onDownloadOptionClick={handleOverTimeDownloadOptionClick}
        onEmptyListLabel={overTimeEmptyFacetValueListLabel}
        onFacetItemClick={handleOverTimeFacetItemClick}
        onFacetValueClick={handleOverTimeFacetValueClick}
        onFilterClick={handleOverTimeFilterButtonClick}
        onFilterClose={handleOverTimeOnClose}
        onFilterSearchChange={handleOverTimeSearchChange}
        onFooterTabClick={handleOverTimeFooterTabClick}
        onNewView={handleOverTimeOnNewView}
        selectedFacetCount={overTimeSelectedFacetCount}
        selectedFacetValues={overTimeSelectedFacetValues}
        selectedFooterTab={overTimeSelectedTab}
        showApplyFilterButton={overTimeShowApplyFilter}
        showClearFilterButton={overTimeShowClearFilter}
        tableColumns={overTimeTableColumns}
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

export default CitationCountsOverTimePage
