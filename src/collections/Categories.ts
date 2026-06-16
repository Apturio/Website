import type { CollectionConfig } from 'payload'

import { autoSlug } from '@/lib/hooks'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug'],
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
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      index: true,
      localized: true,
      admin: {
        description:
          'Auto-generated from title when left empty. Localized per-locale — used in /[lang]/blog/category/[slug].',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
    },
  ],
}
