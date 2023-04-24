import { createClassFromSpec } from 'react-vega'
import React from 'react'
import PropTypes from 'prop-types'

import { fullColors } from './__helpers__/colors'

const PieChart = props => {
  const { data, thetaField, colorField } = props

  const Chart = createClassFromSpec({
    spec: {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      description: 'Pie Chart',
      data: {
        values: data,
      },
      mark: 'arc',
      encoding: {
        theta: { field: thetaField, type: 'quantitative' },
        color: {
          field: colorField,
          type: 'nominal',
          scale: {
            range: fullColors,
          },
        },
      },
    },
  })

  return <Chart />
}

PieChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  thetaField: PropTypes.string.isRequired,
  colorField: PropTypes.string.isRequired,
}

export default PieChart
