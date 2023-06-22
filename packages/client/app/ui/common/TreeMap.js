import React from 'react'
import PropTypes from 'prop-types'
import { createClassFromSpec } from 'react-vega'

import { chartBackground, subjectColors } from './__helpers__/colors'

const TreeMap = props => {
  const { data, colorField, legendTitle, valueField, onNewView } = props

  const Chart = createClassFromSpec({
    spec: {
      $schema: 'https://vega.github.io/schema/vega/v5.json',
      width: 400,
      height: 280,
      padding: 10,
      // autosize: { type: 'fit', contains: 'padding' },
      autosize: { type: 'pad', resize: true, contains: 'padding' },
      data: [
        {
          name: 'tree',
          values: data,
          transform: [
            {
              type: 'stratify',
              key: 'id',
              parentKey: 'parent',
            },
            {
              type: 'treemap',
              field: valueField,
              size: [{ signal: 'width' }, { signal: 'height' }],
            },
          ],
        },
      ],

      scales: [
        {
          name: 'color',
          type: 'ordinal',
          range: subjectColors,
        },
      ],
      //   encoding: {
      //     tooltip: [
      //       {
      //         field: colorField,
      //         type: 'nominal',
      //         //   title: colorFieldTooltipTitle,
      //       },
      //       {
      //         field: valueField,
      //         format: ',',
      //         type: 'quantitative',
      //         //   title: thetaFieldTooltipTitle,
      //       },
      //     ],
      //   },

      marks: [
        {
          type: 'rect',
          from: { data: 'tree' },
          encode: {
            enter: {
              fill: { scale: 'color', field: colorField },
            },
            update: {
              x: { field: 'x0' },
              x2: { field: 'x1' },
              y: { field: 'y0' },
              y2: { field: 'y1' },
            },
          },
        },
      ],

      legends: [
        {
          fill: 'color',
          title: legendTitle,
        },
      ],

      config: {
        background: chartBackground,
        axis: {
          labelFont: 'Barlow',
          labelFontWeight: 500,
          labelFontSize: '12',
        },
        legend: {
          titleFont: 'Barlow',
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
      tooltip={{ theme: 'custom' }}
    />
  )
}

TreeMap.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  colorField: PropTypes.string.isRequired,
  legendTitle: PropTypes.string.isRequired,
  valueField: PropTypes.string.isRequired,
  onNewView: PropTypes.func,
}

TreeMap.defaultProps = {
  onNewView: () => {},
}

export default TreeMap
