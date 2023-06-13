import React, { useEffect, useRef, useState } from 'react'
import { useLazyQuery, useQuery } from '@apollo/client'
import { json2csv } from 'json-2-csv'
import { cloneDeep } from 'lodash'

import { Dashboard, VisuallyHiddenElement } from '../ui'

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

const DashboardPage = () => {
  const [fullFacetOptions, setFullFacetOptions] = useState([])

  // #region overTimeStates
  const [overTimeSelectedTab, setOverTimeSelectedTab] =
    useState(overTimeDefaultTab)

  const [overTimeFilters, setOverTimeFilters] = useState(overTimeFilterParams)

  const [overTimeDisplayFacetValues, setOverTimeDisplayFacetValues] = useState(
    [],
  )

  const [overTimeSelectedFacetValues, setOverTimeSelectedFacetValues] =
    useState([])

  const [overTimeShowApplyFilter, setOverTimeShowApplyFilter] = useState(false)

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

  // #endregion overTimeStates

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
    byYearQuery()
  }, [])

  useEffect(() => {
    const storedFilters = JSON.parse(localStorage.getItem('overTimeFilters'))

    if (storedFilters) {
      setOverTimeFilters(
        storedFilters.map(f => ({ ...f, isFacetSelected: false })),
      )
    } else {
      localStorage.setItem('overTimeFilters', JSON.stringify(overTimeFilters))
    }

    return () => {
      localStorage.removeItem('overTimeFilters')
    }
  }, [])

  useEffect(setOverTimeEmptyListLabel, [overTimeDisplayFacetValues])

  // #region overTimeFilters

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

    setOverTimeShowApplyFilter(false)
    setOverTimeDisplayFacetValues([])

    const params = overTimeFilters
      .map(f => ({
        field: `${f.type}Id`,
        operator: { in: f.values.map(s => s.id) },
      }))
      .filter(v => !!v.operator.in.length)

    byYearQuery({ variables: { input: { search: { criteria: params } } } })
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

    storedFilters.forEach(storedFacet => {
      const currentFacet = overTimeFilters.find(
        f => f.type === storedFacet.type,
      )

      if (currentFacet.values.length !== storedFacet.values.length) {
        shouldShowApplyButton = true
      }
    })

    setOverTimeShowApplyFilter(shouldShowApplyButton)
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

  const handlOverTimeOnNewView = view => {
    overTimeNewView.current = view
  }

  // #endregion overTimeFilters

  return (
    <>
      <VisuallyHiddenElement as="h1">Dashboard page</VisuallyHiddenElement>
      <Dashboard
        byPublisherShowExpandButton
        bySourceShowExpandButton
        bySubjectShowExpandButton
        corpusGrowthShowExpandButton
        overTimeData={
          overTimeSelectedTab === 'chart'
            ? overTimeVisualisationData
            : transformChartData(
                overTimeVisualisationData,
                'xField',
                'stackField',
                'yField',
              )
        }
        overTimeFilterParams={overTimeFilters}
        overTimeFilterValueOptions={overTimeDisplayFacetValues}
        overTimeIsDownloadListOpen={overTimeIsDownloadListOpen}
        overTimeIsFilterOpen={overTimeIsFilterOpen}
        overTimeLoading={byYearDataLoading || fullFacetOptionsLoading}
        overTimeOnApplyFilters={handleOverTimeApplyFilters}
        overTimeOnDownloadOptionClick={handleOverTimeDownloadOptionClick}
        overTimeOnEmptyListLabel={overTimeEmptyFacetValueListLabel}
        overTimeOnFacetItemClick={handleOverTimeFacetItemClick}
        overTimeOnFacetValueClick={handleOverTimeFacetValueClick}
        overTimeOnFilterClick={handleOverTimeFilterButtonClick}
        overTimeOnFilterClose={handleOverTimeOnClose}
        overTimeOnFilterSearchChange={handleOverTimeSearchChange}
        overTimeOnFooterTabClick={handleOverTimeFooterTabClick}
        overTimeOnNewView={handlOverTimeOnNewView}
        overTimeSelectedFacetValues={overTimeSelectedFacetValues}
        overTimeSelectedFooterTab={overTimeSelectedTab}
        overTimeShowExpandButton
        overTimeShowFilterFooter={overTimeShowApplyFilter}
        overTimeTableColumns={overTimeTableColumns}
        uniqueCountShowExpandButton
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

export default DashboardPage
