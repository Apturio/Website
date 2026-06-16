import type { Block } from 'payload'

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
        { name: 'icon', type: 'text', admin: { description: 'Lucide icon name for the dot.' } },
        { name: 'tag', type: 'text', admin: { description: 'Small uppercase phase tag.' } },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
      ],
    },
  ],
}
