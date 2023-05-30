import React from 'react'
import PropTypes from 'prop-types'
import { createClassFromSpec } from 'react-vega'

import { chartBackground, idColors } from './__helpers__/colors'

const StackedBarChart = props => {
  const {
    data,
    stackField,
    stackItems,
    xLabelAngle,
    xField,
    yField,
    stackFieldTooltipTitle,
    yFieldTooltipTitle,
  } = props

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
      mark: { type: 'bar' },
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
            range: idColors,
          },
          title: null,
        },
        order: {
          field: stackField,
        },
        tooltip: [
          {
            field: stackField,
            type: 'nominal',
            title: stackFieldTooltipTitle,
          },
          {
            field: yField,
            type: 'quantitative',
            title: yFieldTooltipTitle,
          },
        ],
      },
      config: {
        view: {
          stroke: null,
        },
        background: chartBackground,
        axis: {
          labelFont: 'Barlow',
          labelFontWeight: 500,
          labelFontSize: '12',
        },
        legend: {
          labelFont: 'Barlow',
          labelFontWeight: 500,
          labelFontSize: '12',
        },
      },
    },
  })

  return (
    <Chart
      actions={false}
      style={{ width: '100%', height: '100%' }}
      tooltip={{
        theme: 'custom',
      }}
    />
  )
}

StackedBarChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  stackField: PropTypes.string.isRequired,
  stackItems: PropTypes.arrayOf(PropTypes.string).isRequired,
  xLabelAngle: PropTypes.number,
  xField: PropTypes.string.isRequired,
  yField: PropTypes.string.isRequired,
  stackFieldTooltipTitle: PropTypes.string.isRequired,
  yFieldTooltipTitle: PropTypes.string.isRequired,
}

StackedBarChart.defaultProps = {
  xLabelAngle: 0,
}

export default StackedBarChart
