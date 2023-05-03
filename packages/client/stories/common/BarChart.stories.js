import React from 'react'
import { BarChart } from '../../app/ui'

const randomNumber = ceiling => {
  return Math.floor(Math.random() * ceiling)
}

const data = [
  { year: 2010, value: randomNumber(1000) },
  { year: 2011, value: randomNumber(1000) },
  { year: 2012, value: randomNumber(1000) },
  { year: 2013, value: randomNumber(1000) },
  { year: 2014, value: randomNumber(1000) },
  { year: 2015, value: randomNumber(1000) },
  { year: 2016, value: randomNumber(1000) },
  { year: 2017, value: randomNumber(1000) },
  { year: 2018, value: randomNumber(1000) },
  { year: 2019, value: randomNumber(1000) },
]

// eslint-disable-next-line react/jsx-props-no-spreading
export const Base = args => (
  <BarChart {...args} data={data} xField="year" yField="value" />
)

export default {
  component: BarChart,
  title: 'Common/BarChart',
}
