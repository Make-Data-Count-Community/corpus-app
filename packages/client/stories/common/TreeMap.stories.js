import React from 'react'
import { uuid } from '@coko/client'
import { TreeMap } from '../../app/ui'

const parentId = uuid()

const randomNumber = ceiling => {
  return Math.floor(Math.random() * ceiling)
}

const data = [
  { id: parentId, name: 0, value: 0, parent: null },
  { id: uuid(), name: 2000, value: randomNumber(1000), parent: parentId },
  { id: uuid(), name: 2001, value: randomNumber(1000), parent: parentId },
  { id: uuid(), name: 2002, value: randomNumber(1000), parent: parentId },
  { id: uuid(), name: 2003, value: randomNumber(1000), parent: parentId },
  { id: uuid(), name: 2004, value: randomNumber(1000), parent: parentId },
  { id: uuid(), name: 2005, value: randomNumber(1000), parent: parentId },
  { id: uuid(), name: 2006, value: randomNumber(1000), parent: parentId },
  { id: uuid(), name: 2007, value: randomNumber(1000), parent: parentId },
  { id: uuid(), name: 2008, value: randomNumber(1000), parent: parentId },
  { id: uuid(), name: 2009, value: randomNumber(1000), parent: parentId },
  { id: uuid(), name: 2010, value: randomNumber(1000), parent: parentId },
  { id: uuid(), name: 2011, value: randomNumber(1000), parent: parentId },
  { id: uuid(), name: 2012, value: randomNumber(1000), parent: parentId },
  { id: uuid(), name: 2013, value: randomNumber(1000), parent: parentId },
  { id: uuid(), name: 2014, value: randomNumber(1000), parent: parentId },
  { id: uuid(), name: 2015, value: randomNumber(1000), parent: parentId },
  { id: uuid(), name: 2016, value: randomNumber(1000), parent: parentId },
  { id: uuid(), name: 2017, value: randomNumber(1000), parent: parentId },
  { id: uuid(), name: 2018, value: randomNumber(1000), parent: parentId },
  { id: uuid(), name: 2019, value: randomNumber(1000), parent: parentId },
]

// eslint-disable-next-line react/jsx-props-no-spreading
export const Base = args => (
  <TreeMap {...args} colorField="name" data={data} valueField="value" />
)

export default {
  component: TreeMap,
  title: 'Common/TreeMap',
}
