import React from 'react'
import PropTypes from 'prop-types'
import { createClassFromSpec } from 'react-vega'

import { fullColors } from './__helpers__/colors'

const StackedBarChart = props => {
  const {
    data,
    stackField,
    stackItems,
    stackTitle,
    xLabelAngle,
    xField,
    yField,
  } = props

  const Chart = createClassFromSpec({
    spec: {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      description: 'Stacked Bar Chart',
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
          aggregate: 'sum',
          title: null,
        },
        color: {
          field: stackField,
          type: 'nominal',
          scale: {
            domain: stackItems,
            range: fullColors,
          },
          title: stackTitle,
        },
      },
    },
  })

  return <Chart />
}

StackedBarChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  stackField: PropTypes.string.isRequired,
  stackItems: PropTypes.arrayOf(PropTypes.string).isRequired,
  stackTitle: PropTypes.string.isRequired,
  xLabelAngle: PropTypes.number,
  xField: PropTypes.string.isRequired,
  yField: PropTypes.string.isRequired,
}

StackedBarChart.defaultProps = {
  xLabelAngle: 0,
}

export default StackedBarChart
