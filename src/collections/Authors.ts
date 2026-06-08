import type { CollectionConfig } from 'payload'

import { autoSlug } from '@/lib/hooks'

export const Authors: CollectionConfig = {
  slug: 'authors',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'role'],
    group: 'Blog',
  },
  hooks: {
    beforeValidate: [autoSlug('name')],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description: 'Auto-generated from name when left empty. Used in /[lang]/blog/author/[slug].',
      },
    },
    {
      name: 'role',
      type: 'text',
      localized: true,
      admin: {
        description: 'Job title / department shown on the author hero (e.g. "Head of Growth").',
      },
    },
    {
      name: 'bio',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'socials',
      type: 'group',
      fields: [
        { name: 'linkedin', type: 'text' },
        { name: 'x', type: 'text' },
        { name: 'website', type: 'text' },
      ],
    },
    {
      name: 'expertise',
      type: 'array',
      labels: { singular: 'Topic', plural: 'Topics' },
      admin: {
        description: 'Topic tags shown in the author sidebar (e.g. "AI Automation").',
      },
      fields: [{ name: 'topic', type: 'text', required: true }],
    },
    {
      name: 'stats',
      type: 'group',
      admin: {
        description: 'Optional vanity stats. Article count is computed at read time in Phase 9.',
      },
      fields: [{ name: 'reads', type: 'number', admin: { description: 'Total reads (manual/analytics).' } }],
    },
  ],
}
