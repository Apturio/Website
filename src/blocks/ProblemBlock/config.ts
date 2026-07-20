import type { Block } from 'payload'

const ICON_OPTIONS = [
  { label: 'Trending Down', value: 'TrendingDown' },
  { label: 'Clock', value: 'Clock' },
  { label: 'Layers', value: 'Layers' },
  { label: 'Bot', value: 'Bot' },
  { label: 'Settings', value: 'Settings' },
  { label: 'Activity', value: 'Activity' },
]

/**
 * ProblemBlock — the "Why You Need Apturio" pain-point grid. Rendered by
 * ProblemBlockComponent which reuses the existing <TheProblem> markup. Seeded
 * from messages `problem.*`.
 */
export const ProblemBlock: Block = {
  slug: 'problem',
  interfaceName: 'ProblemBlock',
  labels: {
    singular: 'Problem',
    plural: 'Problems',
  },
  imageURL: '/block-previews/problem.png',
  imageAltText: 'Problem block preview',
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'text',
      admin: { description: 'Green pill text under the heading.' },
    },
    {
      name: 'items',
      type: 'array',
      labels: { singular: 'Pain Card', plural: 'Pain Cards' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
        {
          name: 'icon',
          type: 'select',
          options: ICON_OPTIONS,
          admin: { description: 'Card icon.' },
        },
      ],
    },
  ],
}
