import type { Block } from 'payload'

import { iconPickerField } from '@/fields/IconPicker/config'

/** TimelineBlock — vertical timeline (.timeline / .tl-item). */
export const TimelineBlock: Block = {
  slug: 'timeline',
  interfaceName: 'TimelineBlock',
  labels: { singular: 'Timeline', plural: 'Timelines' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text', required: true },
    {
      name: 'items',
      type: 'array',
      labels: { singular: 'Item', plural: 'Items' },
      fields: [
        iconPickerField({ name: 'icon', admin: { description: 'Icon for the dot.' } }),
        { name: 'tag', type: 'text', admin: { description: 'Small uppercase phase tag.' } },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
      ],
    },
  ],
}
