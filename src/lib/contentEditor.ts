import {
  lexicalEditor,
  BlocksFeature,
  EXPERIMENTAL_TableFeature,
} from '@payloadcms/richtext-lexical'

import { Callout } from '@/blocks/Callout'
import { InlineCTABanner } from '@/blocks/InlineCTABanner'

/**
 * Shared Lexical editor for long-form Post/Page `content` fields. Extends the
 * default feature set with:
 *  - the two custom editorial blocks (Callout, Inline CTA Banner) via BlocksFeature
 *  - tables via EXPERIMENTAL_TableFeature (Payload's official table node; still
 *    flagged experimental upstream). Content lives in the existing jsonb column,
 *    so enabling it requires no DB migration.
 *
 * Registration shape (Payload 3.85):
 *   lexicalEditor({
 *     features: ({ defaultFeatures }) => [
 *       ...defaultFeatures,
 *       BlocksFeature({ blocks: [Callout, InlineCTABanner] }),
 *       EXPERIMENTAL_TableFeature(),
 *     ],
 *   })
 */
export const contentEditor = lexicalEditor({
  features: ({ defaultFeatures }) => [
    ...defaultFeatures,
    BlocksFeature({
      blocks: [Callout, InlineCTABanner],
    }),
    EXPERIMENTAL_TableFeature(),
  ],
})
