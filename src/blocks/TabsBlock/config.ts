import type { Block } from 'payload'

import { iconPickerField } from '@/fields/IconPicker/config'

/** TabsBlock — use-case tabs with split panel (.tabs / .tab-nav / .tab-panel). */
export const TabsBlock: Block = {
  slug: 'tabs',
  interfaceName: 'TabsBlock',
  labels: { singular: 'Tabs', plural: 'Tabs' },
  imageURL: '/block-previews/tabs.png',
  imageAltText: 'Tabs block preview',
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text', required: true },
    {
      name: 'tabs',
      type: 'array',
      labels: { singular: 'Tab', plural: 'Tabs' },
      fields: [
        iconPickerField({ name: 'icon', admin: { description: 'Icon for the tab button.' } }),
        { name: 'label', type: 'text', required: true },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
        {
          name: 'bullets',
          type: 'array',
          labels: { singular: 'Bullet', plural: 'Bullets' },
          fields: [{ name: 'text', type: 'text', required: true }],
        },
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'placeholder', type: 'text' },
      ],
    },
  ],
}
