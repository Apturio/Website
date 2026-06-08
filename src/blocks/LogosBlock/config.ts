import type { Block } from 'payload'

/**
 * LogosBlock — the "Trusted By" marquee plus the global-operations country
 * chips. Rendered by LogosBlockComponent which reuses the existing <TrustedBy>
 * markup. Seeded from messages `trustedBy.*` + the hardcoded logo list.
 */
export const LogosBlock: Block = {
  slug: 'logos',
  interfaceName: 'LogosBlock',
  labels: {
    singular: 'Logos / Trusted By',
    plural: 'Logos / Trusted By',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'logos',
      type: 'array',
      labels: { singular: 'Logo', plural: 'Logos' },
      fields: [
        { name: 'name', type: 'text', required: true },
        {
          name: 'src',
          type: 'text',
          required: true,
          admin: { description: 'Logo image URL.' },
        },
        {
          name: 'old',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Legacy logo (renders with the grayscale screen treatment).' },
        },
      ],
    },
    {
      name: 'globalOperations',
      type: 'text',
      admin: { description: 'Small uppercase label above the country chips.' },
    },
    {
      name: 'countries',
      type: 'array',
      labels: { singular: 'Country', plural: 'Countries' },
      fields: [
        { name: 'name', type: 'text', required: true },
        {
          name: 'code',
          type: 'text',
          required: true,
          admin: { description: 'ISO 2-letter country code (drives the flag image).' },
        },
      ],
    },
  ],
}
