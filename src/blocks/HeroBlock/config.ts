import type { Block } from 'payload'

/**
 * HeroBlock — the top-of-home hero (badge, headline, subheading, two CTAs,
 * optional logo). Rendered by HeroBlockComponent which reuses the existing
 * <Hero> presentational markup. Seeded from messages `hero.*`.
 */
export const HeroBlock: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock',
  labels: {
    singular: 'Hero',
    plural: 'Heroes',
  },
  imageURL: '/block-previews/hero.png',
  imageAltText: 'Hero block preview',
  fields: [
    {
      name: 'badge',
      type: 'text',
      admin: { description: 'Eyebrow / pill above the headline.' },
    },
    {
      name: 'title',
      type: 'textarea',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'ctaPrimaryLabel',
      type: 'text',
    },
    {
      name: 'ctaPrimaryHref',
      type: 'text',
      admin: { description: 'Primary CTA destination (e.g. #pricing).' },
    },
    {
      name: 'ctaSecondaryLabel',
      type: 'text',
    },
    {
      name: 'ctaSecondaryHref',
      type: 'text',
      admin: {
        description:
          'Secondary CTA destination. External links (https://wa.me/...) render a chat icon and open in a new tab; internal links render a calendar icon.',
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Optional logo shown above the headline.' },
    },
  ],
}
