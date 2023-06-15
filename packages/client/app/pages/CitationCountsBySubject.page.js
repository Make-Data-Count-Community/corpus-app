import React, { useEffect, useRef, useState } from 'react'
import { useLazyQuery, useQuery } from '@apollo/client'
import { json2csv } from 'json-2-csv'
import { cloneDeep } from 'lodash'

import { CitationCountsBySubject, VisuallyHiddenElement } from '../ui'

import { GET_BY_SUBJECT, GET_FULL_FACET_OPTIONS } from '../graphql'

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

const bySubjectTableColumns = [
  {
    title: 'Subject',
    dataIndex: 'xField',
    key: 'xField',
  },
  {
    title: 'Total Citations',
    dataIndex: 'yField',
    key: 'yField',
    render: value =>
      value?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || 0,
  },
]

const bySubjectFilterParams = [
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

const bySubjectDefaultTab = 'chart'

const CitationCountsBySubjectPage = () => {
  const [fullFacetOptions, setFullFacetOptions] = useState([])

  const [bySubjectSelectedTab, setBySubjectSelectedTab] =
    useState(bySubjectDefaultTab)

  const [bySubjectFilters, setBySubjectFilters] = useState(
    bySubjectFilterParams,
  )

  const [bySubjectDisplayFacetValues, setBySubjectDisplayFacetValues] =
    useState([])

  const [bySubjectSelectedFacetValues, setBySubjectSelectedFacetValues] =
    useState([])

  const [bySubjectShowApplyFilter, setBySubjectShowApplyFilter] =
    useState(false)

  const [bySubjectVisualisationData, setBySubjectVisualisationData] = useState(
    [],
  )

  const [bySubjectIsFilterOpen, setBySubjectIsFilterOpen] = useState(false)

  const [bySubjectIsDownloadListOpen, setBySubjectIsDownloadListOpen] =
    useState(false)

  const [
    bySubjectEmptyFacetValueListLabel,
    setBySubjectEmptyFacetValueListLabel,
  ] = useState(facetNotSelectedLabel)

  const bySubjectNewView = useRef(null)

  const setBySubjectEmptyListLabel = () => {
    const selectedFacet = bySubjectFilters.find(f => f.isFacetSelected)

    setBySubjectEmptyFacetValueListLabel(
      !!selectedFacet && bySubjectDisplayFacetValues.length === 0
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

  const [bySubjectQuery, { loading: bySubjectDataLoading }] = useLazyQuery(
    GET_BY_SUBJECT,
    {
      variables: {
        input: {
          search: {
            criteria: [],
          },
        },
      },
      onCompleted: data => {
        const getAssertionsPerSubject = cloneDeep(
          data.getAssertionsPerSubject,
        ).map(s => ({
          ...s,
          yField: parseInt(s.yField, 10),
          parent: 0,
        }))

        const idArray = [
          {
            id: 0,
            xField: '',
            yField: 0,
            parent: null,
          },
        ]

        setBySubjectVisualisationData(idArray.concat(getAssertionsPerSubject))
      },
    },
  )

  useEffect(() => {
    const storedFilters = JSON.parse(localStorage.getItem('bySubjectFilters'))

    if (storedFilters) {
      setBySubjectFilters(
        storedFilters.map(f => ({ ...f, isFacetSelected: false })),
      )
    } else {
      localStorage.setItem('bySubjectFilters', JSON.stringify(bySubjectFilters))
    }

    const bySubjectParams = bySubjectFilters
      .map(f => ({
        field: `${f.type}Id`,
        operator: { in: f.values.map(s => s.id) },
      }))
      .filter(v => !!v.operator.in.length)

    bySubjectQuery({
      variables: { input: { search: { criteria: bySubjectParams } } },
    })

    return () => {
      localStorage.removeItem('bySubjectFilters')
    }
  }, [])

  useEffect(setBySubjectEmptyListLabel, [bySubjectDisplayFacetValues])

  const handleBySubjectFooterTabClick = tabTitle => {
    if (tabTitle === 'download') {
      setBySubjectIsDownloadListOpen(!bySubjectIsDownloadListOpen)
    } else {
      setBySubjectSelectedTab(tabTitle)
    }
  }

  const handleBySubjectApplyFilters = () => {
    setBySubjectIsFilterOpen(false)

    const filters = bySubjectFilters.map(f => ({
      ...f,
      isFacetSelected: false,
    }))

    localStorage.setItem('bySubjectFilters', JSON.stringify(filters))

    setBySubjectShowApplyFilter(false)
    setBySubjectDisplayFacetValues([])

    const params = bySubjectFilters
      .map(f => ({
        field: `${f.type}Id`,
        operator: { in: f.values.map(s => s.id) },
      }))
      .filter(v => !!v.operator.in.length)

    bySubjectQuery({
      variables: { input: { search: { criteria: params } } },
    })
  }

  const handleBySubjectFacetItemClick = facetType => {
    const facetIndex = bySubjectFilters.findIndex(f => f.type === facetType)

    setBySubjectFilters(
      bySubjectFilters.map((f, i) => ({
        ...f,
        isFacetSelected: i === facetIndex,
      })),
    )

    setBySubjectDisplayFacetValues(
      fullFacetOptions.find(f => f.type === facetType).values,
    )

    setBySubjectSelectedFacetValues(bySubjectFilters[facetIndex].values)
  }

  const handleBySubjectFacetValueClick = valueId => {
    const facet = bySubjectFilters.find(f => f.isFacetSelected)

    if (facet.values.find(s => s.id === valueId)) {
      facet.values = bySubjectSelectedFacetValues.filter(v => v.id !== valueId)
    } else {
      facet.values = [
        ...facet.values,
        bySubjectDisplayFacetValues.find(option => option.id === valueId),
      ]
    }

    setBySubjectFilters(
      bySubjectFilters.map(f =>
        f.type === facet.type ? { ...f, ...{ values: facet.values } } : f,
      ),
    )

    setBySubjectSelectedFacetValues(facet.values)

    const storedFilters = JSON.parse(localStorage.getItem('bySubjectFilters'))
    let shouldShowApplyButton = false

    storedFilters.forEach(storedFacet => {
      const currentFacet = bySubjectFilters.find(
        f => f.type === storedFacet.type,
      )

      if (currentFacet.values.length !== storedFacet.values.length) {
        shouldShowApplyButton = true
      }
    })

    setBySubjectShowApplyFilter(shouldShowApplyButton)
  }

  const handleBySubjectOnClose = () => {
    setBySubjectIsFilterOpen(false)
    const storedFilters = JSON.parse(localStorage.getItem('bySubjectFilters'))

    if (bySubjectIsFilterOpen) {
      setBySubjectFilters(storedFilters)
    }

    setBySubjectDisplayFacetValues([])
  }

  const handleBySubjectFilterButtonClick = isOpen => {
    if (isOpen) {
      const storedFilters = JSON.parse(localStorage.getItem('bySubjectFilters'))
      setBySubjectFilters(storedFilters)
    }

    setBySubjectDisplayFacetValues([])
    setBySubjectShowApplyFilter(false)
    setBySubjectIsFilterOpen(isOpen)
  }

  const handleBySubjectSearchChange = rawSearchValue => {
    const searchValue = rawSearchValue.target.value
    const facetType = bySubjectFilters.find(f => f.isFacetSelected).type

    const targetFacet = fullFacetOptions.find(f => f.type === facetType)

    if (searchValue === '') {
      setBySubjectDisplayFacetValues(targetFacet.values)
    } else {
      setBySubjectDisplayFacetValues(
        targetFacet.values.filter(v =>
          v.title.toLowerCase().includes(searchValue.toLowerCase()),
        ),
      )
    }
  }

  const handleBySubjectDownloadOptionClick = async type => {
    setBySubjectIsDownloadListOpen(false)

    if (type === 'csv') {
      const csvString = await json2csv(
        addKeytoData(bySubjectVisualisationData),
        {
          keys: [
            { field: 'xField', title: 'Subject' },
            { field: 'yField', title: 'Total Citations' },
          ],
        },
      )

      downloadFile(csvString, 'Citation counts by subject.csv')
    } else if (type === 'png' || type === 'svg') {
      const imgString = await bySubjectNewView.current.toImageURL(
        type,
        type === 'png' ? 4 : 2,
      )

      downloadFile(imgString, `Citation counts by subject.${type}`, type)
    }
  }

  const handleBySubjectOnNewView = view => {
    bySubjectNewView.current = view
  }

  return (
    <>
      <VisuallyHiddenElement as="h1">
        Citation counts by subject page
      </VisuallyHiddenElement>
      <CitationCountsBySubject
        data={
          bySubjectSelectedTab === 'chart'
            ? bySubjectVisualisationData
            : addKeytoData(bySubjectVisualisationData)
        }
        filterParams={bySubjectFilters}
        filterValueOptions={bySubjectDisplayFacetValues}
        isDownloadListOpen={bySubjectIsDownloadListOpen}
        isFilterOpen={bySubjectIsFilterOpen}
        loading={bySubjectDataLoading || fullFacetOptionsLoading}
        onApplyFilters={handleBySubjectApplyFilters}
        onDownloadOptionClick={handleBySubjectDownloadOptionClick}
        onEmptyListLabel={bySubjectEmptyFacetValueListLabel}
        onFacetItemClick={handleBySubjectFacetItemClick}
        onFacetValueClick={handleBySubjectFacetValueClick}
        onFilterClick={handleBySubjectFilterButtonClick}
        onFilterClose={handleBySubjectOnClose}
        onFilterSearchChange={handleBySubjectSearchChange}
        onFooterTabClick={handleBySubjectFooterTabClick}
        onNewView={handleBySubjectOnNewView}
        selectedFacetValues={bySubjectSelectedFacetValues}
        selectedFooterTab={bySubjectSelectedTab}
        showFilterFooter={bySubjectShowApplyFilter}
        tableColumns={bySubjectTableColumns}
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

export default CitationCountsBySubjectPage
