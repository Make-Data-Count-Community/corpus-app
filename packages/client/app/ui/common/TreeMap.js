import React from 'react'
import PropTypes from 'prop-types'
import { createClassFromSpec } from 'react-vega'

import { chartBackground, fullColors } from './__helpers__/colors'

const TreeMap = props => {
  const { data, colorField, valueField } = props

  const Chart = createClassFromSpec({
    spec: {
      $schema: 'https://vega.github.io/schema/vega/v5.json',
      width: 500,
      height: 300,
      autosize: { type: 'fit', contains: 'padding' },
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
          range: fullColors,
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
          },
        },
      ],

      legends: [
        {
          fill: 'color',
        },
      ],

      config: {
        background: chartBackground,
      },
    },
  })

  return <Chart actions={false} style={{ width: '100%', height: '100%' }} />
}

TreeMap.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  colorField: PropTypes.string.isRequired,
  valueField: PropTypes.string.isRequired,
}

export default TreeMap
