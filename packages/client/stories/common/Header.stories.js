import React from 'react'
import { Header } from '../../app/ui'

// eslint-disable-next-line react/jsx-props-no-spreading
export const Base = args => <Header {...args} currentPath="/dashboard" />

export default {
  component: Header,
  title: 'Common/Header',
}
