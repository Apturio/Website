import type { Field } from 'payload'

import { iconPickerField } from '@/fields/IconPicker/config'

/**
 * Shared field set for the four service-page hero variants. The headline is
 * split into three parts so the middle word(s) can render in the brand or green
 * accent color, mirroring the prototype's `<span class="accent|green">`.
 */
export const heroFields: Field[] = [
  iconPickerField({ name: 'pillIcon', admin: { description: 'Icon for the eyebrow pill.' } }),
  { name: 'pillText', type: 'text', required: true },
  {
    name: 'titleStart',
    type: 'text',
    required: true,
    admin: { description: 'Headline text before the accented phrase.' },
  },
  {
    name: 'titleAccent',
    type: 'text',
    admin: { description: 'Accented phrase (rendered in the brand or green color).' },
  },
  {
    name: 'titleEnd',
    type: 'text',
    admin: { description: 'Headline text after the accented phrase.' },
  },
  {
    name: 'accentColor',
    type: 'select',
    defaultValue: 'brand',
    options: [
      { label: 'Periwinkle (brand)', value: 'brand' },
      { label: 'Green', value: 'green' },
    ],
  },
  { name: 'subtitle', type: 'textarea' },
  { name: 'ctaPrimaryLabel', type: 'text' },
  { name: 'ctaPrimaryHref', type: 'text' },
  iconPickerField({ name: 'ctaSecondaryIcon', admin: { description: 'Optional icon for the secondary CTA.' } }),
  { name: 'ctaSecondaryLabel', type: 'text' },
  { name: 'ctaSecondaryHref', type: 'text' },
  {
    name: 'micro',
    type: 'array',
    labels: { singular: 'Micro item', plural: 'Micro items' },
    admin: { description: 'Small checkmark items under the CTAs (centered/split heroes).' },
    fields: [{ name: 'text', type: 'text', required: true }],
  },
]
