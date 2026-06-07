import type { CollectionConfig } from 'payload'

import { autoSlug } from '@/lib/hooks'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'lang', 'slug'],
    group: 'Blog',
  },
  hooks: {
    beforeValidate: [autoSlug('title')],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description: 'Auto-generated from title when left empty. Used in /[lang]/blog/category/[slug].',
      },
    },
    {
      name: 'lang',
      type: 'select',
      required: true,
      defaultValue: 'en',
      options: [
        { label: 'English', value: 'en' },
        { label: 'Español', value: 'es' },
      ],
    },
    {
      name: 'relatedLocale',
      type: 'relationship',
      relationTo: 'categories',
      admin: {
        description:
          'Link to the equivalent category in the other language. Set on BOTH documents for hreflang.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
  ],
}
