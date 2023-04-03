import React from 'react'
import PropTypes from 'prop-types'
import { createClassFromSpec } from 'react-vega'

const LineChart = props => {
  const { data, xField, yField } = props

  const Chart = createClassFromSpec({
    spec: {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      description: 'Line Chart',
      mark: 'line',
      data: {
        values: data,
      },
      encoding: {
        x: { field: xField },
        y: { field: yField },
      },
    },
  })

  return <Chart />
}

LineChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  xField: PropTypes.string.isRequired,
  yField: PropTypes.string.isRequired,
}

export default LineChart
