import type { Block } from 'payload'

/** BigQuoteBlock — single large testimonial (.big-quote). */
export const BigQuoteBlock: Block = {
  slug: 'bigQuote',
  interfaceName: 'BigQuoteBlock',
  labels: { singular: 'Big Quote', plural: 'Big Quotes' },
  fields: [
    {
      name: 'glowTop',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Add the periwinkle glow band above the quote.' },
    },
    { name: 'quote', type: 'textarea', required: true },
    { name: 'authorName', type: 'text', required: true },
    { name: 'authorRole', type: 'text' },
    { name: 'avatar', type: 'upload', relationTo: 'media' },
  ],
}
