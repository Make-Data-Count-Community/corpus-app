import React from 'react'
import { lorem } from 'faker'

import { Paragraph, Text } from '../../app/ui'

export const Base = () => <Paragraph>{lorem.sentences(10)}</Paragraph>

export const ParagraphDemo = () => <Paragraph>{lorem.sentences(10)}</Paragraph>

export const TextDemo = () => <Text>{lorem.sentence()}</Text>
export const StrongText = () => <Text strong>{lorem.sentence()}</Text>

export default {
  title: 'Common/Typography',
}
