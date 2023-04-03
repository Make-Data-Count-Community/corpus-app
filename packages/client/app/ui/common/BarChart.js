import React from 'react'
import PropTypes from 'prop-types'
import { createClassFromSpec } from 'react-vega'

const BarChart = props => {
  const { data, xLabelAngle, xField, yField } = props

  const Chart = createClassFromSpec({
    spec: {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      description: 'Bar Chart',
      data: {
        values: data,
      },
      mark: 'bar',
      encoding: {
        x: {
          field: xField,
          type: 'nominal',
          axis: { labelAngle: xLabelAngle },
        },
        y: { field: yField, type: 'quantitative' },
      },
    },
  })

  return <Chart />
}

BarChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  xLabelAngle: PropTypes.number,
  xField: PropTypes.string.isRequired,
  yField: PropTypes.string.isRequired,
}

BarChart.defaultProps = {
  xLabelAngle: -90,
}

export default BarChart
