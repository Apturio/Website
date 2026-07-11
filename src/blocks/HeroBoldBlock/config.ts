import type { Block } from 'payload'

import { heroFields } from '../_shared/heroFields'
import { iconPickerField } from '@/fields/IconPicker/config'

/** HeroBoldBlock — asymmetric hero with floating stat cards (.hero-asym). */
export const HeroBoldBlock: Block = {
  slug: 'heroBold',
  interfaceName: 'HeroBoldBlock',
  labels: { singular: 'Hero — Bold', plural: 'Heroes — Bold' },
  imageURL: '/block-previews/heroBold.png',
  imageAltText: 'Hero — Bold block preview',
  fields: [
    ...heroFields,
    {
      name: 'cards',
      type: 'array',
      labels: { singular: 'Stat card', plural: 'Stat cards' },
      fields: [
        iconPickerField({ name: 'icon', admin: { description: 'Icon.' } }),
        { name: 'big', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
        {
          name: 'green',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Render the icon in the green accent.' },
        },
      ],
    },
  ],
}
