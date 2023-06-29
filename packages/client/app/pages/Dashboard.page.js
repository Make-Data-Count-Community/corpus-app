import React, { useEffect, useRef, useState } from 'react'
import { useLazyQuery, useQuery } from '@apollo/client'
import { json2csv } from 'json-2-csv'
import { cloneDeep } from 'lodash'

import { Dashboard, VisuallyHiddenElement } from '../ui'

import {
  GET_BY_PUBLISHER,
  GET_BY_SOURCE,
  GET_BY_SUBJECT,
  GET_BY_YEAR,
  GET_CORPUS_GROWTH,
  GET_FULL_FACET_OPTIONS,
  GET_UNIQUE_COUNT,
} from '../graphql'

const facetNotSelectedLabel = 'Please select a facet'
const displayListEmptyLabel = 'No matches found'

const footerLinks = {
  homepage: '/',
  termsOfUse: 'https://datacite.org/terms.html',
  privacyPolicy: 'https://datacite.org/privacy.html',
  twitterUrl: 'https://twitter.com/datacite',
  githubUrl: 'https://github.com/datacite/datacite',
  youtubeUrl: 'https://www.youtube.com/channel/UCVsSDZhIN_WbnD_v5o9eB_A',
  linkedinUrl: 'https://www.linkedin.com/company/datacite',
  contactUs: 'mailto:support@datacite.org',
  blog: 'https://blog.datacite.org/',
  team: 'https://datacite.org/team.html',
  whatWeDo: 'https://datacite.org/value.html',
  governance: 'https://datacite.org/governance.html',
  jobOpportunities: 'https://datacite.org/jobopportunities.html',
  steeringGroups: 'https://datacite.org/steering.html',
  createDois: 'https://doi.datacite.org/',
  discoverMetadata: 'https://commons.datacite.org/',
  integrateApis: 'https://datacite.org/integratorapis.html',
  partnerServices: 'https://datacite.org/partnerservices.html',
  metadataSchema: 'https://schema.datacite.org/',
  support: 'https://support.datacite.org/',
  feeModel: 'https://datacite.org/feemodel.html',
  members: 'https://datacite.org/members.html',
  partners: 'https://datacite.org/partners.html',
  serviceProviders: 'https://datacite.org/service-providers.html',
  roadmap: 'https://datacite.org/roadmap.html',
  fairWorkflows: 'https://datacite.org/fair-workflows.html',
  imprint: 'https://datacite.org/imprint.html',
}

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
    render: value => value?.toLocaleString('en-US') || 0,
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

const corpusGrowthTableColumns = [
  {
    title: 'Date of Ingest',
    dataIndex: 'xField',
    key: 'xField',
    render: value => {
      const parsedValue = Date.parse(value)
      return new Date(parsedValue).toLocaleDateString('en-US')
    },
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
    title: 'Total',
    dataIndex: 'total',
    key: 'total',
    render: value => value?.toLocaleString('en-US') || 0,
  },
]

const corpusGrowthDefaultTab = 'chart'

const uniqueCountColumns = [
  {
    title: 'Facet',
    dataIndex: 'facet',
    key: 'facet',
  },
  {
    title: 'Third party aggregator',
    dataIndex: 'thirdPartyAggr',
    key: 'thirdPartyAggr',
    render: value => value?.toLocaleString('en-US') || 0,
  },
  {
    title: 'PID Metadata',
    dataIndex: 'pidMetadata',
    key: 'pidMetadata',
    render: value => value?.toLocaleString('en-US') || 0,
  },
  {
    title: 'Total',
    dataIndex: 'total',
    key: 'total',
    render: value => value?.toLocaleString('en-US') || 0,
  },
]

const uniqueCountDefaultTab = 'table'

const DashboardPage = () => {
  const [fullFacetOptions, setFullFacetOptions] = useState([])

  const [corpusGrowthData, setCorpusGrowthData] = useState([])

  const [corpusGrowthSelectedTab, setCorpusGrowthSelectedTab] = useState(
    corpusGrowthDefaultTab,
  )

  const [corpusGrowthIsDowloadListOpen, setCorpusGrowthIsDownloadListOpen] =
    useState(false)

  const corpusGrowthNewView = useRef(null)

  const [uniqueCountData, setUniqueCountData] = useState([])

  const [uniqueCountSelectedTab, setUniqueCountSelectedTab] = useState(
    uniqueCountDefaultTab,
  )

  const [uniqueCountIsDowloadListOpen, setUniqueCountIsDownloadListOpen] =
    useState(false)

  // #region overTimeStates
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

  // #endregion overTimeStates

  // #region bySubjectStates
  const [bySubjectSelectedTab, setBySubjectSelectedTab] =
    useState(bySubjectDefaultTab)

  const [bySubjectFilters, setBySubjectFilters] = useState(
    bySubjectFilterParams,
  )

  const [bySubjectDisplayFacetValues, setBySubjectDisplayFacetValues] =
    useState([])

  const [bySubjectSelectedFacetCount, setBySubjectSelectedFacetCount] =
    useState(0)

  const [bySubjectSelectedFacetValues, setBySubjectSelectedFacetValues] =
    useState([])

  const [bySubjectShowApplyFilter, setBySubjectShowApplyFilter] =
    useState(false)

  const [bySubjectShowClearFilter, setBySubjectShowClearFilter] =
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

  // #endregion bySubjectStates

  // #region byPublisherStates

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

  // #endregion byPublisherStates

  // #region bySourceStates

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

  // #endregion bySourceStates

  // #region hooks

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
        ).map(s => ({
          ...s,
          yField: parseInt(s.yField, 10),
        }))

        setByPublisherVisualisationData(getAssertionsPerPublisher)
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

  const { loading: uniqueCountLoading } = useQuery(GET_UNIQUE_COUNT, {
    onCompleted: data => {
      const getUniqueCounts = cloneDeep(data.getAssertionUniqueCounts)

      setUniqueCountData(getUniqueCounts)
    },
  })

  const { loading: corpusGrowthLoading } = useQuery(GET_CORPUS_GROWTH, {
    onCompleted: data => {
      const getCorpusGrowthRaw = cloneDeep(data.getCorpusGrowth).sort((a, b) =>
        a.xField < b.xField ? -1 : 1,
      )

      let totalDoi = 0
      let totalAccession = 0

      const getCorpusGrowthEdited = getCorpusGrowthRaw.map(g => {
        let yField = parseInt(g.yField, 10)

        if (g.stackField === 'DOI') {
          yField += totalDoi
          totalDoi = yField
        } else {
          yField += totalAccession
          totalAccession = yField
        }

        return {
          ...g,
          xField: new Date(parseInt(g.xField, 10)),
          yField,
        }
      })

      setCorpusGrowthData(getCorpusGrowthEdited)
    },
  })

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

  useEffect(() => {
    const storedFilters = JSON.parse(localStorage.getItem('bySubjectFilters'))

    const parsedFilters =
      storedFilters?.map(f => ({
        ...f,
        isFacetSelected: false,
      })) || []

    if (storedFilters) {
      setBySubjectFilters(parsedFilters)

      let shouldShowClearButton = false
      let selectionCount = 0

      storedFilters.forEach(s => {
        if (s.values.length) {
          shouldShowClearButton = true
          selectionCount += 1
        }
      })

      setBySubjectSelectedFacetCount(selectionCount)
      setBySubjectShowClearFilter(shouldShowClearButton)
    } else {
      localStorage.setItem('bySubjectFilters', JSON.stringify(bySubjectFilters))
    }

    const bySubjectParams = storedFilters
      ? parsedFilters
          .map(f => ({
            field: `${f.type}Id`,
            operator: { in: f.values.map(s => s.id) },
          }))
          .filter(v => !!v.operator.in.length)
      : []

    bySubjectQuery({
      variables: { input: { search: { criteria: bySubjectParams } } },
    })

    return () => {
      localStorage.removeItem('bySubjectFilters')
    }
  }, [])

  useEffect(setBySubjectEmptyListLabel, [bySubjectDisplayFacetValues])

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

  // #endregion hooks

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

  // #endregion overTimeFilters

  // #region bySubjectFilters

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

    let selectionCount = 0

    filters.forEach(s => {
      if (s.values.length) {
        selectionCount += 1
      }
    })

    setBySubjectSelectedFacetCount(selectionCount)

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

  const handleBySubjectClearFilters = () => {
    setBySubjectIsFilterOpen(false)
    setBySubjectShowClearFilter(false)
    setBySubjectShowApplyFilter(false)
    setBySubjectSelectedFacetCount(0)
    localStorage.setItem(
      'bySubjectFilters',
      JSON.stringify(bySubjectFilterParams),
    )
    bySubjectQuery({
      variables: { input: { search: { criteria: [] } } },
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
    let shouldShowClearButton = false

    storedFilters.forEach(storedFacet => {
      const currentFacet = bySubjectFilters.find(
        f => f.type === storedFacet.type,
      )

      if (storedFacet.values.length) {
        shouldShowClearButton = true
      }

      if (compareArrays(currentFacet.values, storedFacet.values)) {
        shouldShowApplyButton = true
      }
    })

    setBySubjectShowApplyFilter(shouldShowApplyButton)
    setBySubjectShowClearFilter(shouldShowClearButton)
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

      let shouldShowClearButton = false

      storedFilters.forEach(s => {
        if (s.values.length) {
          shouldShowClearButton = true
        }
      })

      setBySubjectShowClearFilter(shouldShowClearButton)
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

  // #endregion bySubjectFilters

  // #region byPublisherFilters

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

  // #endregion byPublisherFilters

  // #region bySourceFilters

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

  // #endregion bySourceFilters

  const handleCorpusGrowthFooterTabClick = tabTitle => {
    if (tabTitle === 'download') {
      setCorpusGrowthIsDownloadListOpen(!corpusGrowthIsDowloadListOpen)
    } else {
      setCorpusGrowthSelectedTab(tabTitle)
    }
  }

  const handleCorpusGrowthDownloadOptionClick = async type => {
    setCorpusGrowthIsDownloadListOpen(false)

    if (type === 'csv') {
      const parsedData = corpusGrowthData.map(c => {
        const parsedValue = Date.parse(c.xField)
        return {
          ...c,
          xField: new Date(parsedValue).toLocaleDateString('en-US'),
        }
      })

      const csvString = await json2csv(
        transformChartData(parsedData, 'xField', 'stackField', 'yField'),
        {
          keys: [
            { field: 'xField', title: 'Date of Ingest' },
            { field: 'DOI', title: 'DOI' },
            { field: 'Accession Number', title: 'Accession Number' },
            { field: 'total', title: 'Total' },
          ],
        },
      )

      downloadFile(csvString, 'Data citations corpus growth.csv')
    } else if (type === 'png' || type === 'svg') {
      const imgString = await corpusGrowthNewView.current.toImageURL(
        type,
        type === 'png' ? 4 : 2,
      )

      downloadFile(imgString, `Data citations corpus growth.${type}`, type)
    }
  }

  const handleCorpusGrowthNewView = view => {
    corpusGrowthNewView.current = view
  }

  const handleUniqueCountFooterTabClick = tabTitle => {
    if (tabTitle === 'download') {
      setUniqueCountIsDownloadListOpen(!uniqueCountIsDowloadListOpen)
    } else {
      setUniqueCountSelectedTab(tabTitle)
    }
  }

  const handleUniqueCountDownloadOptionClick = async type => {
    setUniqueCountIsDownloadListOpen(false)

    if (type === 'csv') {
      const csvString = await json2csv(uniqueCountData, {
        keys: [
          { field: 'facet', title: 'Facet' },
          { field: 'thirdPartyAggr', title: 'Third party aggregator' },
          { field: 'pidMetadata', title: 'PID Metadata' },
          { field: 'total', title: 'Total' },
        ],
      })

      downloadFile(
        csvString,
        'Counts of unique repositories, journals, subjects, affiliations, funders.csv',
      )
    }
  }

  // #endregion bySourceFilters

  return (
    <>
      <VisuallyHiddenElement as="h1">Dashboard page</VisuallyHiddenElement>
      <Dashboard
        byPublisherData={
          byPublisherSelectedTab === 'chart'
            ? byPublisherVisualisationData
            : addKeytoData(byPublisherVisualisationData)
        }
        byPublisherFilterParams={byPublisherFilters}
        byPublisherFilterValueOptions={byPublisherDisplayFacetValues}
        byPublisherIsDownloadListOpen={byPublisherIsDownloadListOpen}
        byPublisherIsFilterOpen={byPublisherIsFilterOpen}
        byPublisherLoading={byPublisherDataLoading || fullFacetOptionsLoading}
        byPublisherOnApplyFilters={handleByPublisherApplyFilters}
        byPublisherOnClearFilters={handleByPublisherClearFilters}
        byPublisherOnDownloadOptionClick={handleByPublisherDownloadOptionClick}
        byPublisherOnEmptyListLabel={byPublisherEmptyFacetValueListLabel}
        byPublisherOnFacetItemClick={handleByPublisherFacetItemClick}
        byPublisherOnFacetValueClick={handleByPublisherFacetValueClick}
        byPublisherOnFilterClick={handleByPublisherFilterButtonClick}
        byPublisherOnFilterClose={handleByPublisherOnClose}
        byPublisherOnFilterSearchChange={handleByPublisherSearchChange}
        byPublisherOnFooterTabClick={handleByPublisherFooterTabClick}
        byPublisherOnNewView={handleByPublisherOnNewView}
        byPublisherSelectedFacetCount={byPublisherSelectedFacetCount}
        byPublisherSelectedFacetValues={byPublisherSelectedFacetValues}
        byPublisherSelectedFooterTab={byPublisherSelectedTab}
        byPublisherShowApplyFilterButton={byPublisherShowApplyFilter}
        byPublisherShowClearFilterButton={byPublisherShowClearFilter}
        byPublisherShowExpandButton
        byPublisherTableColumns={byPublisherTableColumns}
        bySourceData={
          bySourceSelectedTab === 'chart'
            ? bySourceVisualisationData
            : transformChartData(
                bySourceVisualisationData,
                'xField',
                'stackField',
                'yField',
              )
        }
        bySourceFilterParams={bySourceFilters}
        bySourceFilterValueOptions={bySourceDisplayFacetValues}
        bySourceIsDownloadListOpen={bySourceIsDownloadListOpen}
        bySourceIsFilterOpen={bySourceIsFilterOpen}
        bySourceLoading={bySourceDataLoading || fullFacetOptionsLoading}
        bySourceOnApplyFilters={handleBySourceApplyFilters}
        bySourceOnClearFilters={handleBySourceClearFilters}
        bySourceOnDownloadOptionClick={handleBySourceDownloadOptionClick}
        bySourceOnEmptyListLabel={bySourceEmptyFacetValueListLabel}
        bySourceOnFacetItemClick={handleBySourceFacetItemClick}
        bySourceOnFacetValueClick={handleBySourceFacetValueClick}
        bySourceOnFilterClick={handleBySourceFilterButtonClick}
        bySourceOnFilterClose={handleBySourceOnClose}
        bySourceOnFilterSearchChange={handleBySourceSearchChange}
        bySourceOnFooterTabClick={handleBySourceFooterTabClick}
        bySourceOnNewView={handleBySourceOnNewView}
        bySourceSelectedFacetCount={bySourceSelectedFacetCount}
        bySourceSelectedFacetValues={bySourceSelectedFacetValues}
        bySourceSelectedFooterTab={bySourceSelectedTab}
        bySourceShowApplyFilterButton={bySourceShowApplyFilter}
        bySourceShowClearFilterButton={bySourceShowClearFilter}
        bySourceShowExpandButton
        bySourceTableColumns={bySourceTableColumns}
        bySubjectData={
          bySubjectSelectedTab === 'chart'
            ? bySubjectVisualisationData
            : addKeytoData(bySubjectVisualisationData)
        }
        bySubjectFilterParams={bySubjectFilters}
        bySubjectFilterValueOptions={bySubjectDisplayFacetValues}
        bySubjectIsDownloadListOpen={bySubjectIsDownloadListOpen}
        bySubjectIsFilterOpen={bySubjectIsFilterOpen}
        bySubjectLoading={bySubjectDataLoading || fullFacetOptionsLoading}
        bySubjectOnApplyFilters={handleBySubjectApplyFilters}
        bySubjectOnClearFilters={handleBySubjectClearFilters}
        bySubjectOnDownloadOptionClick={handleBySubjectDownloadOptionClick}
        bySubjectOnEmptyListLabel={bySubjectEmptyFacetValueListLabel}
        bySubjectOnFacetItemClick={handleBySubjectFacetItemClick}
        bySubjectOnFacetValueClick={handleBySubjectFacetValueClick}
        bySubjectOnFilterClick={handleBySubjectFilterButtonClick}
        bySubjectOnFilterClose={handleBySubjectOnClose}
        bySubjectOnFilterSearchChange={handleBySubjectSearchChange}
        bySubjectOnFooterTabClick={handleBySubjectFooterTabClick}
        bySubjectOnNewView={handleBySubjectOnNewView}
        bySubjectSelectedFacetCount={bySubjectSelectedFacetCount}
        bySubjectSelectedFacetValues={bySubjectSelectedFacetValues}
        bySubjectSelectedFooterTab={bySubjectSelectedTab}
        bySubjectShowApplyFilterButton={bySubjectShowApplyFilter}
        bySubjectShowClearFilterButton={bySubjectShowClearFilter}
        bySubjectShowExpandButton
        bySubjectTableColumns={bySubjectTableColumns}
        corpusGrowthData={
          corpusGrowthSelectedTab === 'chart'
            ? corpusGrowthData
            : transformChartData(
                corpusGrowthData,
                'xField',
                'stackField',
                'yField',
              )
        }
        corpusGrowthIsDownloadListOpen={corpusGrowthIsDowloadListOpen}
        corpusGrowthLoading={corpusGrowthLoading}
        corpusGrowthOnDownloadOptionClick={
          handleCorpusGrowthDownloadOptionClick
        }
        corpusGrowthOnFooterTabClick={handleCorpusGrowthFooterTabClick}
        corpusGrowthOnNewView={handleCorpusGrowthNewView}
        corpusGrowthSelectedFooterTab={corpusGrowthSelectedTab}
        corpusGrowthShowExpandButton
        corpusGrowthTableColumns={corpusGrowthTableColumns}
        footerLinks={footerLinks}
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
        overTimeOnClearFilters={handleOverTimeClearFilters}
        overTimeOnDownloadOptionClick={handleOverTimeDownloadOptionClick}
        overTimeOnEmptyListLabel={overTimeEmptyFacetValueListLabel}
        overTimeOnFacetItemClick={handleOverTimeFacetItemClick}
        overTimeOnFacetValueClick={handleOverTimeFacetValueClick}
        overTimeOnFilterClick={handleOverTimeFilterButtonClick}
        overTimeOnFilterClose={handleOverTimeOnClose}
        overTimeOnFilterSearchChange={handleOverTimeSearchChange}
        overTimeOnFooterTabClick={handleOverTimeFooterTabClick}
        overTimeOnNewView={handleOverTimeOnNewView}
        overTimeSelectedFacetCount={overTimeSelectedFacetCount}
        overTimeSelectedFacetValues={overTimeSelectedFacetValues}
        overTimeSelectedFooterTab={overTimeSelectedTab}
        overTimeShowApplyFilterButton={overTimeShowApplyFilter}
        overTimeShowClearFilterButton={overTimeShowClearFilter}
        overTimeShowExpandButton
        overTimeTableColumns={overTimeTableColumns}
        uniqueCountData={uniqueCountData}
        uniqueCountIsDownloadListOpen={uniqueCountIsDowloadListOpen}
        uniqueCountLoading={uniqueCountLoading}
        uniqueCountOnDownloadOptionClick={handleUniqueCountDownloadOptionClick}
        uniqueCountOnFooterTabClick={handleUniqueCountFooterTabClick}
        uniqueCountSelectedFooterTab={uniqueCountSelectedTab}
        uniqueCountShowExpandButton
        uniqueCountTableColumns={uniqueCountColumns}
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
