import type { Block } from 'payload'

import { heroFields } from '../_shared/heroFields'

/** HeroCenteredBlock — centered service hero (.hero-centered). */
export const HeroCenteredBlock: Block = {
  slug: 'heroCentered',
  interfaceName: 'HeroCenteredBlock',
  labels: { singular: 'Hero — Centered', plural: 'Heroes — Centered' },
  imageURL: '/block-previews/heroCentered.png',
  imageAltText: 'Hero — Centered block preview',
  fields: heroFields,
}
