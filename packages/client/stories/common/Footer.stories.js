import React from 'react'
import { Footer } from '../../app/ui'

// eslint-disable-next-line react/jsx-props-no-spreading
export const Base = args => <Footer {...args} currentPath="/dashboard" />

export default {
  component: Footer,
  title: 'Common/Footer',
}
