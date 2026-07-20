import type { Block } from 'payload'

/**
 * CtaBlock — the final "$2,000 Implementation Advantage" conversion band that
 * sits between the page content and the footer links. Rendered by
 * CtaBlockComponent. Seeded from messages `footer.advantage*`. The button is
 * optional (the current design ships without one — leave label/href empty for
 * visual parity).
 */
export const CtaBlock: Block = {
  slug: 'cta',
  interfaceName: 'CtaBlock',
  labels: {
    singular: 'CTA Band',
    plural: 'CTA Bands',
  },
  imageURL: '/block-previews/cta.png',
  imageAltText: 'CTA Band block preview',
  fields: [
    {
      name: 'badge',
      type: 'text',
      admin: { description: 'Green pill badge (e.g. "$2,000 BONUS INCLUDED").' },
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
      name: 'goal',
      type: 'textarea',
      admin: { description: 'Emphasised goal line (white text).' },
    },
    {
      name: 'safety',
      type: 'textarea',
      admin: { description: 'Green safety / disclaimer line.' },
    },
    {
      name: 'cancelAnytime',
      type: 'text',
      admin: { description: 'Uppercase footnote (e.g. "Cancel anytime").' },
    },
    {
      name: 'buttonLabel',
      type: 'text',
      admin: { description: 'Optional CTA button label. Leave empty to hide the button.' },
    },
    {
      name: 'buttonHref',
      type: 'text',
    },
  ],
}
