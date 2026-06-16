import type { Block } from 'payload'

/**
 * PricingBlock — the three-tier pricing grid. The plan cards are editable here;
 * the supporting "implementation advantage", "enterprise" and the full feature
 * comparison table remain i18n-driven inside PricingBlockComponent (they carry
 * dense, structured copy out of scope for Wave 1 block fields). Seeded from
 * messages `pricing.*`.
 */
export const PricingBlock: Block = {
  slug: 'pricing',
  interfaceName: 'PricingBlock',
  labels: {
    singular: 'Pricing',
    plural: 'Pricing',
  },
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
      name: 'plans',
      type: 'array',
      labels: { singular: 'Plan', plural: 'Plans' },
      fields: [
        {
          name: 'planId',
          type: 'select',
          required: true,
          options: [
            { label: 'Foundation', value: 'foundation' },
            { label: 'Engine (highlighted)', value: 'engine' },
            { label: 'Growth', value: 'growth' },
          ],
          admin: { description: 'Drives the per-tier styling (engine = highlighted center card).' },
        },
        { name: 'name', type: 'text', required: true },
        { name: 'price', type: 'text', required: true, admin: { description: 'e.g. $199' } },
        { name: 'period', type: 'text', admin: { description: 'e.g. " / month" (falls back to i18n).' } },
        { name: 'description', type: 'textarea' },
        {
          name: 'features',
          type: 'array',
          labels: { singular: 'Feature', plural: 'Features' },
          fields: [{ name: 'feature', type: 'text', required: true }],
        },
        { name: 'highlighted', type: 'checkbox', defaultValue: false },
        { name: 'bonus', type: 'text', admin: { description: 'Optional badge above the card (engine tier).' } },
        { name: 'ctaLabel', type: 'text', required: true },
        { name: 'ctaHref', type: 'text' },
        { name: 'subText', type: 'text', admin: { description: 'Optional fine print under the features.' } },
      ],
    },
  ],
}
