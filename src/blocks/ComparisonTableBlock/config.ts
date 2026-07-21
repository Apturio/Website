import type { Block } from 'payload'

/** ComparisonTableBlock — labeled row × N-column comparison table (.cmp-table). */
export const ComparisonTableBlock: Block = {
  slug: 'comparisonTable',
  interfaceName: 'ComparisonTableBlock',
  labels: { singular: 'Comparison Table', plural: 'Comparison Tables' },
  imageURL: '/block-previews/comparisonTable.png',
  imageAltText: 'Comparison Table block preview',
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text', required: true },
    { name: 'subtitle', type: 'textarea' },
    {
      name: 'columns',
      type: 'array',
      labels: { singular: 'Column', plural: 'Columns' },
      admin: { description: 'Comparison column headers (the row-label column is implicit).' },
      minRows: 1,
      fields: [
        { name: 'label', type: 'text', required: true },
        {
          name: 'highlight',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Render this whole column in the brand/green accent (e.g. the Apturio column).' },
        },
      ],
    },
    {
      name: 'rows',
      type: 'array',
      labels: { singular: 'Row', plural: 'Rows' },
      fields: [
        { name: 'label', type: 'text', required: true },
        {
          name: 'values',
          type: 'array',
          labels: { singular: 'Value', plural: 'Values' },
          admin: { description: 'One value per column, in the same order as the columns above.' },
          fields: [
            { name: 'text', type: 'text', required: true },
            {
              name: 'highlight',
              type: 'checkbox',
              defaultValue: false,
              admin: { description: 'Render this cell in the green accent (e.g. the winning value).' },
            },
          ],
        },
      ],
    },
  ],
}
