import type { Block } from 'payload'

import { heroFields } from '../_shared/heroFields'

/** HeroBoldBlock — asymmetric hero with floating stat cards (.hero-asym). */
export const HeroBoldBlock: Block = {
  slug: 'heroBold',
  interfaceName: 'HeroBoldBlock',
  labels: { singular: 'Hero — Bold', plural: 'Heroes — Bold' },
  fields: [
    ...heroFields,
    {
      name: 'cards',
      type: 'array',
      labels: { singular: 'Stat card', plural: 'Stat cards' },
      fields: [
        { name: 'icon', type: 'text', admin: { description: 'Lucide icon name.' } },
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
