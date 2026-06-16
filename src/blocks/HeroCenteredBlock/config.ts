import type { Block } from 'payload'

import { heroFields } from '../_shared/heroFields'

/** HeroCenteredBlock — centered service hero (.hero-centered). */
export const HeroCenteredBlock: Block = {
  slug: 'heroCentered',
  interfaceName: 'HeroCenteredBlock',
  labels: { singular: 'Hero — Centered', plural: 'Heroes — Centered' },
  fields: heroFields,
}
