import { lexicalEditor, BlocksFeature } from '@payloadcms/richtext-lexical'

import { Callout } from '@/blocks/Callout'
import { InlineCTABanner } from '@/blocks/InlineCTABanner'

/**
 * Shared Lexical editor for long-form Post/Page `content` fields. Extends the
 * default feature set with the two custom editorial blocks (Callout, Inline CTA
 * Banner) via BlocksFeature so they appear as insertable blocks in the admin.
 *
 * Registration shape (Payload 3.85):
 *   lexicalEditor({
 *     features: ({ defaultFeatures }) => [
 *       ...defaultFeatures,
 *       BlocksFeature({ blocks: [Callout, InlineCTABanner] }),
 *     ],
 *   })
 */
export const contentEditor = lexicalEditor({
  features: ({ defaultFeatures }) => [
    ...defaultFeatures,
    BlocksFeature({
      blocks: [Callout, InlineCTABanner],
    }),
  ],
})
