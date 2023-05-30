import { createClassFromSpec } from 'react-vega'
import React from 'react'
import PropTypes from 'prop-types'

import { chartBackground, publisherColors } from './__helpers__/colors'

const PieChart = props => {
  const {
    data,
    thetaField,
    colorField,
    colorFieldTooltipTitle,
    thetaFieldTooltipTitle,
  } = props

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
      mark: { type: 'arc', tooltip: true },
      encoding: {
        theta: { field: thetaField, type: 'quantitative', title: null },
        color: {
          field: colorField,
          type: 'nominal',
          scale: {
            range: publisherColors,
          },
        },
        tooltip: [
          {
            field: colorField,
            type: 'nominal',
            title: colorFieldTooltipTitle,
          },
          {
            field: thetaField,
            type: 'quantitative',
            title: thetaFieldTooltipTitle,
          },
        ],
      },
      config: {
        background: chartBackground,
        legend: {
          title: null,
          labelFont: 'Barlow',
          labelFontWeight: 500,
          labelFontSize: '12',
        },
        axis: {
          labelFont: 'Barlow',
          labelFontWeight: 500,
          labelFontSize: '12',
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
  colorFieldTooltipTitle: PropTypes.string.isRequired,
  thetaFieldTooltipTitle: PropTypes.string.isRequired,
}

export default PieChart
