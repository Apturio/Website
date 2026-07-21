import type { Block } from 'payload'

/** IntegrationsBlock — 3-up integration cards with real brand logos (.feat-grid / .feat-card). */
export const IntegrationsBlock: Block = {
  slug: 'integrations',
  interfaceName: 'IntegrationsBlock',
  labels: { singular: 'Integrations Grid', plural: 'Integrations Grids' },
  imageURL: '/block-previews/integrations.png',
  imageAltText: 'Integrations Grid block preview',
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text', required: true },
    { name: 'subtitle', type: 'textarea' },
    {
      name: 'items',
      type: 'array',
      labels: { singular: 'Integration', plural: 'Integrations' },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
        { name: 'logo', type: 'upload', relationTo: 'media' },
        { name: 'href', type: 'text', admin: { description: 'Optional link to the integration doc page.' } },
      ],
    },
  ],
}
