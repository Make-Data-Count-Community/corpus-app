import { createClassFromSpec } from 'react-vega'
import React from 'react'
import PropTypes from 'prop-types'

import { chartBackground, fullColors } from './__helpers__/colors'

const PieChart = props => {
  const { data, thetaField, colorField } = props

  const Chart = createClassFromSpec({
    spec: {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      description: 'Pie Chart',
      width: 'container',
      height: 300,
      autosize: { type: 'fit', contains: 'padding' },
      data: {
        values: data,
      },
      mark: 'arc',
      encoding: {
        theta: { field: thetaField, type: 'quantitative', title: null },
        color: {
          field: colorField,
          type: 'nominal',
          scale: {
            range: fullColors,
          },
        },
      },
      config: {
        background: chartBackground,
        legend: {
          title: null,
        },
      },
    },
  })

  return <Chart actions={false} style={{ width: '100%', height: '100%' }} />
}

PieChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  thetaField: PropTypes.string.isRequired,
  colorField: PropTypes.string.isRequired,
}

export default PieChart
