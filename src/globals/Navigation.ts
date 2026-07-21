import type { Field, GlobalConfig, TextFieldValidation } from 'payload'

import { revalidateNavigation } from '@/lib/hooks'
import { iconPickerField } from '@/fields/IconPicker/config'

/**
 * T-23-01 (threat model, low severity, mitigate): the `href` field is
 * admin-editable free text rendered directly as an anchor `href` by
 * Navbar/Footer. Restrict it to a leading-slash relative path or an http(s)
 * absolute URL so a `javascript:`/`data:` scheme can never be saved — cheap
 * defense-in-depth for a trusted-admin field. Empty values pass (comingSoon
 * items intentionally omit href).
 */
/**
 * WR-02: `status: 'live'` items are documented ("'Live' items are clickable
 * and use href") and rendered ("item.status === 'live' && item.href") as
 * requiring a non-empty href — but nothing previously enforced that. A
 * `live` item left with an empty href silently fell into the `comingSoon`
 * render branch, with no signal anywhere (admin UI or logs) that the data
 * was misconfigured. Reject that combination at validation time instead.
 */
const validateNavHref: TextFieldValidation = (value, { siblingData }) => {
  if (!value) {
    return (siblingData as { status?: string } | undefined)?.status === 'live'
      ? 'Href is required when status is "Live".'
      : true
  }
  if (typeof value !== 'string') return 'Href must be text.'
  const trimmed = value.trim()
  if (/^\//.test(trimmed) || /^https?:\/\//i.test(trimmed)) return true
  return 'Href must start with "/" (relative path) or "http(s)://" (absolute URL).'
}

/**
 * Shared item fields WITHOUT `children` — used both as the base for the
 * full `navItemFields` set below and as the field set for one level of
 * nested children, preventing infinite recursion (Comparativas' 4 pages
 * are the only case that needs a second level, per 23-CONTEXT.md).
 */
const childFields: Field[] = [
  {
    name: 'label',
    type: 'text',
    required: true,
    localized: true,
    admin: { description: 'Visible link label (localized EN/ES).' },
  },
  {
    name: 'href',
    type: 'text',
    validate: validateNavHref,
    admin: {
      description:
        'Locale-relative path with a leading slash (e.g. "/pipeline-crm") or an absolute https URL. Leave empty for "comingSoon" items.',
    },
  },
  {
    name: 'status',
    type: 'select',
    required: true,
    defaultValue: 'comingSoon',
    options: [
      { label: 'Live', value: 'live' },
      { label: 'Coming soon', value: 'comingSoon' },
    ],
    admin: {
      description:
        '"Live" items are clickable and use href. "Coming soon" items render as a disabled badge, ignoring href.',
    },
  },
  iconPickerField({
    name: 'icon',
    required: false,
    admin: { description: 'Optional lucide icon shown next to the label (e.g. calendar-check).' },
  }),
  {
    name: 'description',
    type: 'textarea',
    localized: true,
    admin: { description: 'Optional one-line description shown in mega-menu columns.' },
  },
]

/**
 * Full nav-item field set: `childFields` plus one level of nested `children`
 * (Comparativas-style grouped items). `children` reuses `childFields` (not
 * itself) so nesting stops at one level deep.
 */
const navItemFields: Field[] = [
  ...childFields,
  {
    name: 'children',
    type: 'array',
    labels: { singular: 'Child link', plural: 'Child links' },
    admin: {
      // WR-05: this field saves successfully but no Navbar/Footer renderer
      // currently reads item.children — no error is surfaced anywhere in the
      // admin UI, so state that limitation explicitly here.
      description:
        'Optional grouped child links (e.g. Comparativas\' 4 comparison pages). One level deep only. ' +
        'NOTE: child links are not currently rendered anywhere on the live site — adding or editing ' +
        'them here has no visible effect until a renderer is built to display them.',
    },
    fields: childFields,
  },
]

/**
 * The `Navigation` Payload Global — first Global in the project (Phase 23).
 * Models the exact shape of the static `website/src/lib/nav-links.ts`
 * registry (NavMenu/NavColumn/NavLink/FooterColumn) as admin-editable
 * fields, so an administrator can add/remove/reorder/re-status links
 * without code or redeploy (NAVCMS-01..04). `label`/`description`/
 * `heading`/`triggerLabel`/`columnLabel` are natively localized (same
 * mechanism as Pages/Posts); `href`/`status`/`icon` and array order are
 * shared across locales.
 *
 * `nav-links.ts` is NOT replaced by this Global in this plan — it remains
 * the static emergency fallback if this Global is unreachable (later plan).
 */
export const Navigation: GlobalConfig = {
  slug: 'navigation',
  admin: {
    group: 'Navigation',
    description:
      'Navbar mega menus, direct links, and footer columns. Mirrors website/src/lib/nav-links.ts (the emergency fallback used if this Global cannot be read).',
  },
  hooks: {
    afterChange: [revalidateNavigation],
  },
  fields: [
    {
      name: 'megaMenus',
      type: 'array',
      labels: { singular: 'Mega menu', plural: 'Mega menus' },
      admin: { description: 'Top-level navbar mega-menu triggers (e.g. Producto, Industrias, Recursos).' },
      fields: [
        {
          name: 'triggerLabel',
          type: 'text',
          required: true,
          localized: true,
          admin: { description: 'Label shown on the navbar trigger button.' },
        },
        {
          name: 'columns',
          type: 'array',
          labels: { singular: 'Column', plural: 'Columns' },
          admin: { description: 'Columns rendered inside this mega-menu dropdown.' },
          fields: [
            {
              name: 'columnLabel',
              type: 'text',
              localized: true,
              admin: {
                description: 'Optional column heading. Omit for single-column, headingless menus.',
              },
            },
            {
              name: 'items',
              type: 'array',
              labels: { singular: 'Item', plural: 'Items' },
              admin: { description: 'Links inside this column.' },
              fields: navItemFields,
            },
          ],
        },
      ],
    },
    {
      name: 'directLinks',
      type: 'array',
      labels: { singular: 'Direct link', plural: 'Direct links' },
      admin: {
        description: 'Flat navbar links outside mega menus (e.g. Precios, Sobre nosotros).',
      },
      fields: navItemFields,
    },
    {
      name: 'footerColumns',
      type: 'array',
      labels: { singular: 'Footer column', plural: 'Footer columns' },
      admin: { description: 'Footer columns (e.g. Producto, Industrias, Recursos).' },
      fields: [
        {
          name: 'heading',
          type: 'text',
          required: true,
          localized: true,
          admin: { description: 'Column heading.' },
        },
        {
          name: 'items',
          type: 'array',
          labels: { singular: 'Item', plural: 'Items' },
          admin: { description: 'Primary links in this column.' },
          fields: navItemFields,
        },
        {
          name: 'subgroupHeading',
          type: 'text',
          localized: true,
          admin: {
            description:
              'Optional subgroup heading (e.g. a "Features" or "Comparativas" sub-block within the column).',
          },
        },
        {
          name: 'subgroupItems',
          type: 'array',
          labels: { singular: 'Item', plural: 'Items' },
          admin: { description: 'Links inside the optional subgroup.' },
          fields: navItemFields,
        },
      ],
    },
  ],
}
