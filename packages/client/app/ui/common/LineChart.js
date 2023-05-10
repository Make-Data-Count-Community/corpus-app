import React from 'react'
import PropTypes from 'prop-types'
import { createClassFromSpec } from 'react-vega'

import { chartBackground, primaryBlue } from './__helpers__/colors'

const LineChart = props => {
  const { data, xField, xLabelAngle, yField } = props

  const Chart = createClassFromSpec({
    spec: {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      description: 'Line Chart',
      width: 'container',
      height: 300,
      autosize: { type: 'fit', contains: 'padding' },
      mark: { type: 'line', tooltip: true },
      data: {
        values: data,
      },
      encoding: {
        x: { field: xField, axis: { labelAngle: xLabelAngle }, title: null },
        y: {
          field: yField,
          title: null,
          type: 'quantitative',
          axis: { grid: false },
        },
        color: { value: primaryBlue },
      },
      config: {
        view: {
          stroke: null,
        },
        background: chartBackground,
      },
    },
  })

  return <Chart actions={false} style={{ width: '100%', height: '100%' }} />
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
