import React from 'react'

import { ChartHeader } from '../../app/ui'

const title = 'Chart Title'

export const Base = args => <ChartHeader {...args} title={title} />

export default {
  component: ChartHeader,
  title: 'Common/ChartHeader',
}
