import type { CollectionConfig } from 'payload'

import { contentEditor } from '@/lib/contentEditor'
import { autoSlug, revalidatePagePaths, warnMissingRelatedLocale } from '@/lib/hooks'
import { HeroBlock } from '@/blocks/HeroBlock/config'
import { LogosBlock } from '@/blocks/LogosBlock/config'
import { ProblemBlock } from '@/blocks/ProblemBlock/config'
import { BenefitsBlock } from '@/blocks/BenefitsBlock/config'
import { TestimonialsBlock } from '@/blocks/TestimonialsBlock/config'
import { PricingBlock } from '@/blocks/PricingBlock/config'
import { FaqBlock } from '@/blocks/FaqBlock/config'
import { CtaBlock } from '@/blocks/CtaBlock/config'

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
      name: 'layout',
      type: 'blocks',
      admin: {
        description:
          'Block-based page layout. The home page is built from these 8 section blocks; arbitrary pages can mix any subset.',
      },
      blocks: [
        HeroBlock,
        LogosBlock,
        ProblemBlock,
        BenefitsBlock,
        TestimonialsBlock,
        PricingBlock,
        FaqBlock,
        CtaBlock,
      ],
    },
    {
      name: 'content',
      type: 'richText',
      editor: contentEditor,
      admin: {
        description:
          'Optional long-form rich text for simple pages. Block-based pages use the Layout field above instead.',
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
