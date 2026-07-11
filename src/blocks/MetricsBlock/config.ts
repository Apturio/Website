import type { Block } from 'payload'

/** MetricsBlock — row of stat numbers (.metrics / .metric). */
export const MetricsBlock: Block = {
  slug: 'metrics',
  interfaceName: 'MetricsBlock',
  labels: { singular: 'Metrics', plural: 'Metrics' },
  imageURL: '/block-previews/metrics.png',
  imageAltText: 'Metrics block preview',
  fields: [
    {
      name: 'glowTop',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Add the periwinkle glow band above the metrics.' },
    },
    {
      name: 'items',
      type: 'array',
      labels: { singular: 'Metric', plural: 'Metrics' },
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
        {
          name: 'green',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Render the value in the green accent.' },
        },
      ],
    },
  ],
}
