import type { Block } from 'payload'

/** FeatureAccordionBlock — media + exclusive accordion list (.acc-layout / .acc). */
export const FeatureAccordionBlock: Block = {
  slug: 'featureAccordion',
  interfaceName: 'FeatureAccordionBlock',
  labels: { singular: 'Feature Accordion', plural: 'Feature Accordions' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text', required: true },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'placeholder', type: 'text' },
    {
      name: 'items',
      type: 'array',
      labels: { singular: 'Item', plural: 'Items' },
      fields: [
        { name: 'icon', type: 'text', admin: { description: 'Lucide icon name.' } },
        { name: 'title', type: 'text', required: true },
        { name: 'body', type: 'textarea', required: true },
      ],
    },
  ],
}
