import React, { useState } from 'react'
import { uuid } from '@coko/client'
import { lorem } from 'faker'

import { FacetValueList } from '../../app/ui'

const valueOptions = [
  {
    id: uuid(),
    value: lorem.words(3),
  },
  {
    id: uuid(),
    value: lorem.words(3),
  },
  {
    id: uuid(),
    value: lorem.words(3),
  },
  {
    id: uuid(),
    value: lorem.words(3),
  },
]

const Template = args => {
  const [facetValues, setFacetValues] = useState([])

  const handleOnClick = valueId => {
    if (facetValues.find(f => f.id === valueId)) {
      setFacetValues(facetValues.filter(f => f.id !== valueId))
    } else {
      setFacetValues([
        ...facetValues,
        valueOptions.find(option => option.id === valueId),
      ])
    }
  }

  return (
    <FacetValueList
      {...args}
      onItemClick={handleOnClick}
      selectedFacetValues={facetValues}
      valueOptions={valueOptions}
    />
  )
}

export const Base = Template.bind({})

export default {
  component: FacetValueList,
  title: 'Common/FacetValueList',
}
