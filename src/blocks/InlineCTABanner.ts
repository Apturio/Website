import type { Block } from 'payload'

/**
 * Inline CTA Banner — a custom Lexical block editors insert mid-article. Renders
 * as a dark conversion card inside the white "paper" reading sheet (Phase 9,
 * blockType === 'inlineCTABanner').
 *
 * Fields:
 *  - label:       green pill label (eyebrow)
 *  - heading:     H3 of the banner
 *  - body:        supporting copy
 *  - buttonLabel: CTA button text (always rendered white per design)
 *  - href:        CTA destination
 *  - dark:        whether the banner uses the dark surface (default true)
 */
export const InlineCTABanner: Block = {
  slug: 'inlineCTABanner',
  interfaceName: 'InlineCTABannerBlock',
  labels: {
    singular: 'Inline CTA Banner',
    plural: 'Inline CTA Banners',
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      admin: {
        description: 'Small pill label above the heading (e.g. "Limited offer").',
      },
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'body',
      type: 'textarea',
    },
    {
      name: 'buttonLabel',
      type: 'text',
      required: true,
      defaultValue: 'Get Started',
    },
    {
      name: 'href',
      type: 'text',
      required: true,
      admin: {
        description: 'Destination URL or anchor (e.g. /en/strategy-call or #cta).',
      },
    },
    {
      name: 'dark',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Use the dark banner surface (recommended inside the white paper).',
      },
    },
  ],
}
