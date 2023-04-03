import React from 'react'
import PropTypes from 'prop-types'
import { createClassFromSpec } from 'react-vega'

const MultiLineChart = props => {
  const {
    data,
    stackField,
    stackItems,
    stackTitle,
    xLabelAngle,
    xLabelTitle,
    xField,
    yField,
    yLabelTitle,
  } = props

  const Chart = createClassFromSpec({
    spec: {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      description: 'Stacked Bar Chart',
      data: {
        values: data,
      },
      mark: {
        type: 'line',
        point: 'true',
      },
      encoding: {
        x: {
          field: xField,
          type: 'nominal',
          axis: { labelAngle: xLabelAngle },
          title: xLabelTitle,
        },
        y: {
          field: yField,
          type: 'quantitative',
          aggregate: 'sum',
          title: yLabelTitle,
        },
        color: {
          field: stackField,
          type: 'nominal',
          scale: {
            domain: stackItems,
          },
          title: stackTitle,
        },
      },
    },
  })

  return <Chart />
}

MultiLineChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  stackField: PropTypes.string.isRequired,
  stackItems: PropTypes.arrayOf(PropTypes.string).isRequired,
  stackTitle: PropTypes.string.isRequired,
  xLabelAngle: PropTypes.number,
  xLabelTitle: PropTypes.string.isRequired,
  xField: PropTypes.string.isRequired,
  yField: PropTypes.string.isRequired,
  yLabelTitle: PropTypes.string.isRequired,
}

MultiLineChart.defaultProps = {
  xLabelAngle: -90,
}

export default MultiLineChart
