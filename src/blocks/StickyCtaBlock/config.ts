import type { Block } from 'payload'

/** StickyCtaBlock — floating bottom CTA that appears on scroll (.sticky-cta). */
export const StickyCtaBlock: Block = {
  slug: 'stickyCta',
  interfaceName: 'StickyCtaBlock',
  labels: { singular: 'Sticky CTA', plural: 'Sticky CTAs' },
  imageURL: '/block-previews/stickyCta.png',
  imageAltText: 'Sticky CTA block preview',
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'subtitle', type: 'text', admin: { description: 'Green secondary line (e.g. bonus).' } },
    { name: 'ctaLabel', type: 'text', required: true },
    { name: 'ctaHref', type: 'text', defaultValue: '#strategy' },
  ],
}
