import type { Block } from 'payload'

/** MiniPricingBlock — 3 plans with the featured $299 card (.pricing-spot / .plan). */
export const MiniPricingBlock: Block = {
  slug: 'miniPricing',
  interfaceName: 'MiniPricingBlock',
  labels: { singular: 'Mini Pricing', plural: 'Mini Pricing' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    { name: 'subtitle', type: 'textarea' },
    {
      name: 'single',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Show only the featured plan (standalone .pricing-single).' },
    },
    {
      name: 'plans',
      type: 'array',
      labels: { singular: 'Plan', plural: 'Plans' },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'sub', type: 'text' },
        { name: 'price', type: 'text', required: true },
        { name: 'period', type: 'text', defaultValue: '/mo' },
        {
          name: 'featured',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Highlight this plan (periwinkle border + scale).' },
        },
        { name: 'bonusTag', type: 'text', admin: { description: 'Green pill above a featured plan (e.g. "$2,000 Bonus Included").' } },
        {
          name: 'features',
          type: 'array',
          labels: { singular: 'Feature', plural: 'Features' },
          fields: [
            { name: 'text', type: 'text', required: true },
            {
              name: 'hot',
              type: 'checkbox',
              defaultValue: false,
              admin: { description: 'Emphasize (white/bold + green check) — e.g. "FREE $2,000 Setup".' },
            },
          ],
        },
        { name: 'ctaLabel', type: 'text', required: true },
        { name: 'ctaHref', type: 'text', defaultValue: '#strategy' },
      ],
    },
  ],
}
