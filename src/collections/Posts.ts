import type { CollectionConfig } from 'payload'

import { contentEditor } from '@/lib/contentEditor'
import { autoSlug, computeReadTime, warnMissingRelatedLocale } from '@/lib/hooks'

export const Posts: CollectionConfig = {
  slug: 'posts',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'lang', 'status', 'publishedAt'],
    group: 'Blog',
  },
  versions: {
    drafts: true,
  },
  hooks: {
    beforeValidate: [autoSlug('title'), warnMissingRelatedLocale],
    beforeChange: [computeReadTime],
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
        description: 'Auto-generated from title when empty. Used in /[lang]/blog/[slug].',
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
      relationTo: 'posts',
      admin: {
        description:
          'Link to the same post in the other language. Set on BOTH documents so hreflang emits correctly (Phase 9).',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'authors',
    },
    {
      name: 'excerpt',
      type: 'textarea',
      admin: {
        description: 'Short dek shown on cards and the post header.',
      },
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'content',
      type: 'richText',
      editor: contentEditor,
      admin: {
        description: 'Article body. Insert Callout and Inline CTA Banner blocks anywhere.',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Promote to the full-bleed featured slot on the blog index.',
        position: 'sidebar',
      },
    },
    {
      name: 'readTime',
      type: 'number',
      admin: {
        readOnly: true,
        description: 'Auto-computed from content (minutes).',
        position: 'sidebar',
      },
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
      name: 'relatedPosts',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
      admin: {
        description: 'Manual "Keep reading" cards on the single post (display limited to 3).',
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
