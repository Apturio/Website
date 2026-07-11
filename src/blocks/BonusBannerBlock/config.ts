import type { Block } from 'payload'

/** BonusBannerBlock — full-width $2,000 bonus CTA banner (.cta-bonus). */
export const BonusBannerBlock: Block = {
  slug: 'bonusBanner',
  interfaceName: 'BonusBannerBlock',
  labels: { singular: 'Bonus Banner', plural: 'Bonus Banners' },
  imageURL: '/block-previews/bonusBanner.png',
  imageAltText: 'Bonus Banner block preview',
  fields: [
    { name: 'pillText', type: 'text', admin: { description: 'Green pill label (e.g. "$2,000 Setup Bonus Included").' } },
    { name: 'heading', type: 'text', required: true },
    { name: 'body', type: 'textarea' },
    { name: 'ctaPrimaryLabel', type: 'text' },
    { name: 'ctaPrimaryHref', type: 'text', defaultValue: '#strategy' },
    { name: 'ctaSecondaryLabel', type: 'text' },
    { name: 'ctaSecondaryHref', type: 'text', defaultValue: '#strategy' },
    { name: 'fine', type: 'text' },
  ],
}
