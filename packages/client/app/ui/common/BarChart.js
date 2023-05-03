import React from 'react'
import PropTypes from 'prop-types'
import { createClassFromSpec } from 'react-vega'

import { chartBackground, primaryBlue } from './__helpers__/colors'

const BarChart = props => {
  const { data, xLabelAngle, xField, yField } = props

  const Chart = createClassFromSpec({
    spec: {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      description: 'Bar Chart',
      width: 'container',
      height: 300,
      autosize: { type: 'fit', contains: 'padding' },
      data: {
        values: data,
      },
      mark: 'bar',
      encoding: {
        x: {
          field: xField,
          type: 'nominal',
          axis: { labelAngle: xLabelAngle },
          title: null,
        },
        y: {
          field: yField,
          type: 'quantitative',
          title: null,
          axis: { grid: false },
        },
        color: {
          value: primaryBlue,
        },
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

BarChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  xLabelAngle: PropTypes.number,
  xField: PropTypes.string.isRequired,
  yField: PropTypes.string.isRequired,
}

BarChart.defaultProps = {
  xLabelAngle: 0,
}

export default BarChart
