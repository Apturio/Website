import type { Block } from 'payload'

/**
 * BenefitsBlock — the "Everything you need" feature list. Rendered by
 * BenefitsBlockComponent which reuses the existing <Benefits> markup. Seeded
 * from messages `benefits.*`.
 */
export const BenefitsBlock: Block = {
  slug: 'benefits',
  interfaceName: 'BenefitsBlock',
  labels: {
    singular: 'Benefits',
    plural: 'Benefits',
  },
  imageURL: '/block-previews/benefits.png',
  imageAltText: 'Benefits block preview',
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'textarea',
    },
    {
      name: 'items',
      type: 'array',
      labels: { singular: 'Feature Card', plural: 'Feature Cards' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
      ],
    },
  ],
}
