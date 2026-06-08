import type { CollectionConfig } from 'payload'

import { contentEditor } from '@/lib/contentEditor'
import { autoSlug, revalidatePagePaths, warnMissingRelatedLocale } from '@/lib/hooks'

export const Pages: CollectionConfig = {
  slug: 'pages',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'lang', 'slug', '_status'],
    group: 'Content',
  },
  versions: {
    drafts: true,
  },
  hooks: {
    beforeValidate: [autoSlug('title'), warnMissingRelatedLocale],
    afterChange: [revalidatePagePaths],
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
        description: 'Auto-generated from title when empty. Resolves against the [...slug] catch-all.',
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
      relationTo: 'pages',
      admin: {
        description: 'Link to the same page in the other language. Set on BOTH documents for hreflang.',
      },
    },
    {
      name: 'content',
      type: 'richText',
      editor: contentEditor,
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'metaTitle', type: 'text' },
        { name: 'metaDescription', type: 'textarea' },
        { name: 'ogImage', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
