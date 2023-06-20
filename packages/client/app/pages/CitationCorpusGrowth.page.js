import React, { useRef, useState } from 'react'
import { useQuery } from '@apollo/client'
import { json2csv } from 'json-2-csv'
import { cloneDeep } from 'lodash'

import { CitationCorpusGrowth, VisuallyHiddenElement } from '../ui'

import { GET_CORPUS_GROWTH } from '../graphql'

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

const CitationCorpusGrowthPage = () => {
  const [corpusGrowthData, setCorpusGrowthData] = useState([])

  const [corpusGrowthSelectedTab, setCorpusGrowthSelectedTab] = useState(
    corpusGrowthDefaultTab,
  )

  const [corpusGrowthIsDowloadListOpen, setCorpusGrowthIsDownloadListOpen] =
    useState(false)

  const corpusGrowthNewView = useRef(null)

  const { loading: corpusGrowthLoading } = useQuery(GET_CORPUS_GROWTH, {
    onCompleted: data => {
      const getCorpusGrowthRaw = cloneDeep(data.getCorpusGrowth)

      const getCorpusGrowthEdited = getCorpusGrowthRaw.map(g => ({
        ...g,
        xField: new Date(parseInt(g.xField, 10)),
      }))

      setCorpusGrowthData(getCorpusGrowthEdited)
    },
  })

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

  return (
    <>
      <VisuallyHiddenElement as="h1">
        Data citations corpus growth
      </VisuallyHiddenElement>
      <CitationCorpusGrowth
        data={
          corpusGrowthSelectedTab === 'chart'
            ? corpusGrowthData
            : transformChartData(
                corpusGrowthData,
                'xField',
                'stackField',
                'yField',
              )
        }
        isDownloadListOpen={corpusGrowthIsDowloadListOpen}
        loading={corpusGrowthLoading}
        onDownloadOptionClick={handleCorpusGrowthDownloadOptionClick}
        onFooterTabClick={handleCorpusGrowthFooterTabClick}
        onNewView={handleCorpusGrowthNewView}
        selectedFooterTab={corpusGrowthSelectedTab}
        tableColumns={corpusGrowthTableColumns}
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

export default CitationCorpusGrowthPage
