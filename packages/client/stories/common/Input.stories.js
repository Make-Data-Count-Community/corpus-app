import React from 'react'
import { Input } from '../../app/ui'

const placeholder = 'Placeholder'

export const Base = args => <Input {...args} placeholder={placeholder} />

export default {
  component: Input,
  title: 'Common/Input',
}
