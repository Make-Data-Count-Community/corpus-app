import React from 'react'
import PropTypes from 'prop-types'
import { createClassFromSpec } from 'react-vega'

import { chartBackground, primaryBlue } from './__helpers__/colors'

const LineChart = props => {
  const { data, xField, xLabelAngle, yField, onNewView } = props

  const Chart = createClassFromSpec({
    spec: {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      description: 'Line Chart',
      width: 'container',
      height: 330,
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

LineChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  xField: PropTypes.string.isRequired,
  xLabelAngle: PropTypes.number,
  yField: PropTypes.string.isRequired,
  onNewView: PropTypes.func,
}

LineChart.defaultProps = {
  xLabelAngle: 0,
  onNewView: () => {},
}

export default LineChart
