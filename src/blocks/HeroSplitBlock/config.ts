import type { Block } from 'payload'

import { heroFields } from '../_shared/heroFields'

/** HeroSplitBlock — split hero with media (.hero-split). */
export const HeroSplitBlock: Block = {
  slug: 'heroSplit',
  interfaceName: 'HeroSplitBlock',
  labels: { singular: 'Hero — Split', plural: 'Heroes — Split' },
  imageURL: '/block-previews/heroSplit.png',
  imageAltText: 'Hero — Split block preview',
  fields: [
    ...heroFields,
    { name: 'image', type: 'upload', relationTo: 'media' },
    {
      name: 'placeholder',
      type: 'text',
      admin: { description: 'Placeholder label shown when no image is set.' },
    },
  ],
}
