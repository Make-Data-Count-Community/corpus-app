import React from 'react'
import { MultiLineChart } from '../../app/ui'

const randomNumber = ceiling => {
  return Math.floor(Math.random() * ceiling)
}

const stackItems = ['Type 1', 'Type 2']

const data = [
  { year: 2010, value: randomNumber(1000), type: 'Type 1' },
  { year: 2011, value: randomNumber(1000), type: 'Type 1' },
  { year: 2012, value: randomNumber(1000), type: 'Type 1' },
  { year: 2013, value: randomNumber(1000), type: 'Type 1' },
  { year: 2014, value: randomNumber(1000), type: 'Type 1' },
  { year: 2015, value: randomNumber(1000), type: 'Type 1' },
  { year: 2016, value: randomNumber(1000), type: 'Type 1' },
  { year: 2017, value: randomNumber(1000), type: 'Type 1' },
  { year: 2018, value: randomNumber(1000), type: 'Type 1' },
  { year: 2019, value: randomNumber(1000), type: 'Type 1' },
  { year: 2010, value: randomNumber(1000), type: 'Type 2' },
  { year: 2011, value: randomNumber(1000), type: 'Type 2' },
  { year: 2012, value: randomNumber(1000), type: 'Type 2' },
  { year: 2013, value: randomNumber(1000), type: 'Type 2' },
  { year: 2014, value: randomNumber(1000), type: 'Type 2' },
  { year: 2015, value: randomNumber(1000), type: 'Type 2' },
  { year: 2016, value: randomNumber(1000), type: 'Type 2' },
  { year: 2017, value: randomNumber(1000), type: 'Type 2' },
  { year: 2018, value: randomNumber(1000), type: 'Type 2' },
  { year: 2019, value: randomNumber(1000), type: 'Type 2' },
]

// eslint-disable-next-line react/jsx-props-no-spreading
export const Base = args => (
  <MultiLineChart
    {...args}
    data={data}
    stackField="type"
    stackItems={stackItems}
    xField="year"
    yField="value"
  />
)

export default {
  component: MultiLineChart,
  title: 'Common/MultiLineChart',
}
