import type { Block } from 'payload'

/** FeatureGridBlock — 3-up feature cards (.feat-grid / .feat-card). */
export const FeatureGridBlock: Block = {
  slug: 'featureGrid',
  interfaceName: 'FeatureGridBlock',
  labels: { singular: 'Feature Grid', plural: 'Feature Grids' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text', required: true },
    { name: 'subtitle', type: 'textarea' },
    {
      name: 'splitIntro',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Use the left-aligned two-column intro header (Bold template).' },
    },
    {
      name: 'cards',
      type: 'array',
      labels: { singular: 'Card', plural: 'Cards' },
      fields: [
        { name: 'icon', type: 'text', admin: { description: 'Lucide icon name.' } },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
      ],
    },
  ],
}
