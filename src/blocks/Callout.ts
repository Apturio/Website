import type { Block } from 'payload'

import { selectVariantField } from '@/fields/SelectVariantPreview/config'

/**
 * Callout — a custom Lexical block ("Key Takeaway" style) editors can insert
 * anywhere in Post/Page content. Rendered in Phase 9 via the Lexical-to-JSX
 * converter (blockType === 'callout').
 *
 * Fields:
 *  - variant: visual style token (drives the periwinkle/green/amber tints in design)
 *  - heading: optional bold label shown above the body (e.g. "Key Takeaway")
 *  - text:    short rich text body of the callout
 */
export const Callout: Block = {
  slug: 'callout',
  interfaceName: 'CalloutBlock',
  labels: {
    singular: 'Callout',
    plural: 'Callouts',
  },
  fields: [
    selectVariantField(
      {
        name: 'variant',
        required: true,
        defaultValue: 'keyTakeaway',
        options: [
          { label: 'Key Takeaway', value: 'keyTakeaway' },
          { label: 'Info', value: 'info' },
          { label: 'Success', value: 'success' },
          { label: 'Warning', value: 'warning' },
        ],
        admin: {
          description: 'Visual style of the callout box.',
        },
      },
      {
        keyTakeaway: '/variant-previews/keyTakeaway.png',
        info: '/variant-previews/info.png',
        success: '/variant-previews/success.png',
        warning: '/variant-previews/warning.png',
      },
    ),
    {
      name: 'heading',
      type: 'text',
      admin: {
        description: 'Optional label shown above the body (e.g. "Key Takeaway").',
      },
    },
    {
      name: 'text',
      type: 'richText',
      required: true,
      admin: {
        description: 'Callout body. Keep it short — one or two sentences.',
      },
    },
  ],
}
