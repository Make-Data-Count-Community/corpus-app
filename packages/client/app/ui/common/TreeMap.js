import React from 'react'
import PropTypes from 'prop-types'
import { createClassFromSpec } from 'react-vega'

import { chartBackground, subjectColors } from './__helpers__/colors'

const TreeMap = props => {
  const { data, colorField, legendTitle, valueField, onNewView } = props

  const Chart = createClassFromSpec({
    spec: {
      $schema: 'https://vega.github.io/schema/vega/v5.json',
      autosize: { type: 'fit', contains: 'padding' },

      signals: [
        {
          name: 'padding',
          init: '10',
          on: [{ update: '10', events: 'window:resize' }],
        },
        {
          name: 'width',
          init: '(containerSize()[0] - 2*padding)',
          on: [
            {
              update: '(containerSize()[0] - 2*padding)',
              events: 'window:resize',
            },
          ],
        },
        {
          name: 'height',
          init: '(containerSize()[1] - 2*padding)',
          on: [
            {
              update: '(containerSize()[1] - 2*padding)',
              events: 'window:resize',
            },
          ],
        },
      ],

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
            { type: 'flatten', fields: ['tooltip'] },
            { type: 'filter', expr: 'datum.id !== 0' },
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
            hover: {
              tooltip: { signal: "datum['tooltip']" },
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
          titleFontSize: '14',
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
