import React from 'react'
import { PieChart } from '../../app/ui'

const randomNumber = ceiling => {
  return Math.floor(Math.random() * ceiling)
}

const data = [
  { publisher: 'Publisher 1', value: randomNumber(1000) },
  { publisher: 'Publisher 2', value: randomNumber(1000) },
  { publisher: 'Publisher 3', value: randomNumber(1000) },
  { publisher: 'Publisher 4', value: randomNumber(1000) },
  { publisher: 'Publisher 5', value: randomNumber(1000) },
  { publisher: 'Publisher 6', value: randomNumber(1000) },
  { publisher: 'Publisher 7', value: randomNumber(1000) },
  { publisher: 'Publisher 8', value: randomNumber(1000) },
  { publisher: 'Publisher 9', value: randomNumber(1000) },
  { publisher: 'Publisher 10', value: randomNumber(1000) },
]

// eslint-disable-next-line react/jsx-props-no-spreading
export const Base = args => (
  <PieChart
    {...args}
    colorField="publisher"
    colorFieldTooltipTitle="Publisher"
    data={data}
    thetaField="value"
    thetaFieldTooltipTitle="Citations"
  />
)

export default {
  component: PieChart,
  title: 'Common/PieChart',
}
