import type { Block } from 'payload'

/**
 * TestimonialsBlock — the masonry review wall. Rendered by
 * TestimonialsBlockComponent which reuses the existing <Testimonials> markup.
 * Seeded from messages `testimonials.*`.
 */
export const TestimonialsBlock: Block = {
  slug: 'testimonials',
  interfaceName: 'TestimonialsBlock',
  labels: {
    singular: 'Testimonials',
    plural: 'Testimonials',
  },
  imageURL: '/block-previews/testimonials.png',
  imageAltText: 'Testimonials block preview',
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'textarea',
    },
    {
      name: 'items',
      type: 'array',
      labels: { singular: 'Testimonial', plural: 'Testimonials' },
      fields: [
        { name: 'quote', type: 'textarea', required: true },
        { name: 'author', type: 'text', required: true },
        { name: 'role', type: 'text' },
      ],
    },
  ],
}
