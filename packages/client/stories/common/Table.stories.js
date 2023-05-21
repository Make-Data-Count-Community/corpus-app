import React from 'react'
import { Table } from '../../app/ui'

const randomNumber = ceiling => {
  return Math.floor(Math.random() * ceiling)
}

const columns = [
  {
    title: 'Year',
    dataIndex: 'year',
    key: 'year',
  },
  {
    title: 'Type 1',
    dataIndex: 'Type 1',
    key: 'Type 1',
    render: value =>
      value?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || 0,
  },
  {
    title: 'Type 2',
    dataIndex: 'Type 2',
    key: 'Type 2',
    render: value =>
      value?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || 0,
  },
  {
    title: 'Type 3',
    dataIndex: 'Type 3',
    key: 'Type 3',
    render: value =>
      value?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || 0,
  },
  {
    title: 'Total',
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

const transformData = (data, transformBy, keyField, valueField) => {
  const result = []

  const groupedData = groupBy(data, transformBy)

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

const data = [
  { year: 2010, value: randomNumber(10000000), type: 'Type 1' },
  { year: 2011, value: randomNumber(10000000), type: 'Type 1' },
  { year: 2012, value: randomNumber(10000000), type: 'Type 1' },
  { year: 2013, value: randomNumber(10000000), type: 'Type 1' },
  { year: 2014, value: randomNumber(10000000), type: 'Type 1' },
  { year: 2015, value: randomNumber(10000000), type: 'Type 1' },
  { year: 2016, value: randomNumber(10000000), type: 'Type 1' },
  { year: 2017, value: randomNumber(10000000), type: 'Type 1' },
  { year: 2018, value: randomNumber(10000000), type: 'Type 1' },
  { year: 2019, value: randomNumber(10000000), type: 'Type 1' },
  { year: 2010, value: randomNumber(10000000), type: 'Type 2' },
  { year: 2011, value: randomNumber(10000000), type: 'Type 2' },
  { year: 2012, value: randomNumber(10000000), type: 'Type 2' },
  { year: 2013, value: randomNumber(10000000), type: 'Type 2' },
  { year: 2014, value: randomNumber(10000000), type: 'Type 2' },
  { year: 2015, value: randomNumber(10000000), type: 'Type 2' },
  { year: 2016, value: randomNumber(10000000), type: 'Type 2' },
  { year: 2017, value: randomNumber(10000000), type: 'Type 2' },
  { year: 2018, value: randomNumber(10000000), type: 'Type 2' },
  { year: 2019, value: randomNumber(10000000), type: 'Type 2' },
  { year: 2010, value: randomNumber(10000000), type: 'Type 3' },
  { year: 2011, value: randomNumber(10000000), type: 'Type 3' },
  { year: 2012, value: randomNumber(10000000), type: 'Type 3' },
  { year: 2013, value: randomNumber(10000000), type: 'Type 3' },
  { year: 2014, value: randomNumber(10000000), type: 'Type 3' },
  { year: 2015, value: randomNumber(10000000), type: 'Type 3' },
  { year: 2016, value: randomNumber(10000000), type: 'Type 3' },
  { year: 2017, value: randomNumber(10000000), type: 'Type 3' },
  { year: 2018, value: randomNumber(10000000), type: 'Type 3' },
  { year: 2019, value: randomNumber(10000000), type: 'Type 3' },
]

export const Base = args => (
  <Table
    columns={columns}
    data={transformData(data, 'year', 'type', 'value')}
  />
)

export default {
  component: Table,
  title: 'Common/Table',
}
