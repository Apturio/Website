import type { Block } from 'payload'

import { heroFields } from '../_shared/heroFields'

/** HeroDashboardBlock — centered hero with a large product mockup (.hero-dash). */
export const HeroDashboardBlock: Block = {
  slug: 'heroDashboard',
  interfaceName: 'HeroDashboardBlock',
  labels: { singular: 'Hero — Dashboard', plural: 'Heroes — Dashboard' },
  fields: [
    ...heroFields,
    { name: 'image', type: 'upload', relationTo: 'media' },
    {
      name: 'placeholder',
      type: 'text',
      admin: { description: 'Placeholder label shown when no mockup image is set.' },
    },
  ],
}
