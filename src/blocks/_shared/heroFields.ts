import type { Field, TextFieldValidation } from 'payload'

import { iconPickerField } from '@/fields/IconPicker/config'

/**
 * Rejects href values that could execute as script when rendered directly as
 * an anchor `href` (e.g. `javascript:`/`data:` URIs). Allows relative paths,
 * `#anchor` links, `mailto:`, and http(s) URLs. Empty/undefined values pass,
 * since these CTA href fields are optional.
 */
const validateHref: TextFieldValidation = (value) => {
  if (!value) return true
  return (
    /^(https?:\/\/|\/|#|mailto:)/.test(value) ||
    'Must be a relative path, #anchor, mailto:, or http(s) URL.'
  )
}

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
  { name: 'ctaPrimaryHref', type: 'text', validate: validateHref },
  iconPickerField({ name: 'ctaSecondaryIcon', admin: { description: 'Optional icon for the secondary CTA.' } }),
  { name: 'ctaSecondaryLabel', type: 'text' },
  { name: 'ctaSecondaryHref', type: 'text', validate: validateHref },
  {
    name: 'micro',
    type: 'array',
    labels: { singular: 'Micro item', plural: 'Micro items' },
    admin: { description: 'Small checkmark items under the CTAs (centered/split heroes).' },
    fields: [{ name: 'text', type: 'text', required: true }],
  },
]
