import type { Block } from 'payload'

/**
 * FaqBlock — the accordion FAQ. Rendered by FaqBlockComponent which reuses the
 * existing client-side <FAQ> accordion. Seeded from messages `faq.*`. Answers
 * may contain the [/pay-per-use] / [/add-ons] tokens that expand into inline
 * links (preserved from the original component).
 */
export const FaqBlock: Block = {
  slug: 'faq',
  interfaceName: 'FaqBlock',
  labels: {
    singular: 'FAQ',
    plural: 'FAQs',
  },
  imageURL: '/block-previews/faq.png',
  imageAltText: 'FAQ block preview',
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'items',
      type: 'array',
      labels: { singular: 'Question', plural: 'Questions' },
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'textarea', required: true },
      ],
    },
  ],
}
