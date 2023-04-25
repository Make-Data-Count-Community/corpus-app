import React from 'react'
import PropTypes from 'prop-types'
import { createClassFromSpec } from 'react-vega'

import { primaryBlue } from './__helpers__/colors'

const LineChart = props => {
  const { data, xField, xLabelAngle, yField } = props

  const Chart = createClassFromSpec({
    spec: {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      description: 'Line Chart',
      mark: 'line',
      data: {
        values: data,
      },
      encoding: {
        x: { field: xField, axis: { labelAngle: xLabelAngle }, title: null },
        y: { field: yField, title: null },
        color: { value: primaryBlue },
      },
    },
  })

  return <Chart />
}

LineChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  xField: PropTypes.string.isRequired,
  xLabelAngle: PropTypes.number,
  yField: PropTypes.string.isRequired,
}

LineChart.defaultProps = {
  xLabelAngle: 0,
}

export default LineChart
