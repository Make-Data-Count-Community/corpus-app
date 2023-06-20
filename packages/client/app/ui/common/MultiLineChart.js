import React from 'react'
import PropTypes from 'prop-types'
import { createClassFromSpec } from 'react-vega'

import { chartBackground, idColors } from './__helpers__/colors'

const MultiLineChart = props => {
  const {
    data,
    stackField,
    stackFieldTooltipTitle,
    stackItems,
    xLabelAngle,
    xField,
    yField,
    yFieldTooltipTitle,
    onNewView,
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
      mark: { type: 'line', tooltip: true },
      encoding: {
        x: {
          field: xField,
          type: 'ordinal',
          axis: { labelAngle: xLabelAngle },
          timeUnit: 'yearmonthdate',
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
          legend: {
            title: null,
          },
        },
        tooltip: [
          {
            field: stackField,
            type: 'nominal',
            title: stackFieldTooltipTitle,
          },
          {
            field: yField,
            format: ',',
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
      onNewView={onNewView}
      style={{ width: '100%', height: '100%' }}
      tooltip={{
        theme: 'custom',
      }}
    />
  )
}

MultiLineChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  stackField: PropTypes.string.isRequired,
  stackFieldTooltipTitle: PropTypes.string.isRequired,
  stackItems: PropTypes.arrayOf(PropTypes.string).isRequired,
  xLabelAngle: PropTypes.number,
  xField: PropTypes.string.isRequired,
  yField: PropTypes.string.isRequired,
  yFieldTooltipTitle: PropTypes.string.isRequired,
  onNewView: PropTypes.func,
}

MultiLineChart.defaultProps = {
  xLabelAngle: 0,
  onNewView: () => {},
}

export default MultiLineChart
