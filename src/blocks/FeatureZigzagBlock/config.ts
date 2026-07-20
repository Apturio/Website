import type { Block } from 'payload'

/** FeatureZigzagBlock — alternating media/copy rows (.zig / .zig-row). */
export const FeatureZigzagBlock: Block = {
  slug: 'featureZigzag',
  interfaceName: 'FeatureZigzagBlock',
  labels: { singular: 'Feature Zigzag', plural: 'Feature Zigzags' },
  imageURL: '/block-previews/featureZigzag.png',
  imageAltText: 'Feature Zigzag block preview',
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    {
      name: 'rows',
      type: 'array',
      labels: { singular: 'Row', plural: 'Rows' },
      fields: [
        { name: 'num', type: 'text', admin: { description: 'Kicker label, e.g. "01" or "The problem".' } },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
        {
          name: 'bullets',
          type: 'array',
          labels: { singular: 'Bullet', plural: 'Bullets' },
          fields: [{ name: 'text', type: 'text', required: true }],
        },
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'placeholder', type: 'text' },
      ],
    },
  ],
}
