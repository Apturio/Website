import type { Block } from 'payload'

import { iconPickerField } from '@/fields/IconPicker/config'

/** FeatureAccordionBlock — media + exclusive accordion list (.acc-layout / .acc). */
export const FeatureAccordionBlock: Block = {
  slug: 'featureAccordion',
  interfaceName: 'FeatureAccordionBlock',
  labels: { singular: 'Feature Accordion', plural: 'Feature Accordions' },
  imageURL: '/block-previews/featureAccordion.png',
  imageAltText: 'Feature Accordion block preview',
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
        iconPickerField({ name: 'icon', admin: { description: 'Icon.' } }),
        { name: 'title', type: 'text', required: true },
        { name: 'body', type: 'textarea', required: true },
      ],
    },
  ],
}
