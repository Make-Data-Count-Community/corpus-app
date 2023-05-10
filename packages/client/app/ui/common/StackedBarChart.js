import React from 'react'
import PropTypes from 'prop-types'
import { createClassFromSpec } from 'react-vega'

import { chartBackground, fullColors } from './__helpers__/colors'

const StackedBarChart = props => {
  const { data, stackField, stackItems, xLabelAngle, xField, yField } = props

  const Chart = createClassFromSpec({
    spec: {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      description: 'Stacked Bar Chart',
      width: 'container',
      height: 300,
      autosize: { type: 'fit', contains: 'padding' },
      data: {
        values: data,
      },
      mark: { type: 'bar', tooltip: true },
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
          axis: { grid: false },
        },
        color: {
          field: stackField,
          type: 'nominal',
          scale: {
            domain: stackItems,
            range: fullColors,
          },
          title: null,
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

StackedBarChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  stackField: PropTypes.string.isRequired,
  stackItems: PropTypes.arrayOf(PropTypes.string).isRequired,
  xLabelAngle: PropTypes.number,
  xField: PropTypes.string.isRequired,
  yField: PropTypes.string.isRequired,
}

StackedBarChart.defaultProps = {
  xLabelAngle: 0,
}

export default StackedBarChart
