import type { CollectionConfig } from 'payload'

import { contentEditor } from '@/lib/contentEditor'
import { autoSlug, revalidatePagePaths } from '@/lib/hooks'
import { jsonLdOverrideField } from './fields/jsonLdOverride'
import { HeroBlock } from '@/blocks/HeroBlock/config'
import { LogosBlock } from '@/blocks/LogosBlock/config'
import { ProblemBlock } from '@/blocks/ProblemBlock/config'
import { BenefitsBlock } from '@/blocks/BenefitsBlock/config'
import { TestimonialsBlock } from '@/blocks/TestimonialsBlock/config'
import { PricingBlock } from '@/blocks/PricingBlock/config'
import { FaqBlock } from '@/blocks/FaqBlock/config'
import { CtaBlock } from '@/blocks/CtaBlock/config'
// Wave 2 — service-page block library
import { HeroCenteredBlock } from '@/blocks/HeroCenteredBlock/config'
import { HeroSplitBlock } from '@/blocks/HeroSplitBlock/config'
import { HeroDashboardBlock } from '@/blocks/HeroDashboardBlock/config'
import { HeroBoldBlock } from '@/blocks/HeroBoldBlock/config'
import { FeatureGridBlock } from '@/blocks/FeatureGridBlock/config'
import { FeatureZigzagBlock } from '@/blocks/FeatureZigzagBlock/config'
import { FeatureAccordionBlock } from '@/blocks/FeatureAccordionBlock/config'
import { StepsBlock } from '@/blocks/StepsBlock/config'
import { TimelineBlock } from '@/blocks/TimelineBlock/config'
import { TabsBlock } from '@/blocks/TabsBlock/config'
import { MetricsBlock } from '@/blocks/MetricsBlock/config'
import { BigQuoteBlock } from '@/blocks/BigQuoteBlock/config'
import { MiniPricingBlock } from '@/blocks/MiniPricingBlock/config'
import { StrategyFormBlock } from '@/blocks/StrategyFormBlock/config'
import { StickyCtaBlock } from '@/blocks/StickyCtaBlock/config'
import { BonusBannerBlock } from '@/blocks/BonusBannerBlock/config'

export const Pages: CollectionConfig = {
  slug: 'pages',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status'],
    group: 'Content',
  },
  versions: {
    drafts: true,
  },
  hooks: {
    beforeValidate: [autoSlug('title')],
    afterChange: [revalidatePagePaths],
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
          'Auto-generated from title when empty. Localized per-locale — resolves against the [...slug] catch-all.',
      },
    },
    {
      name: 'layout',
      type: 'blocks',
      localized: true,
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
        // Wave 2 — service-page blocks
        HeroCenteredBlock,
        HeroSplitBlock,
        HeroDashboardBlock,
        HeroBoldBlock,
        FeatureGridBlock,
        FeatureZigzagBlock,
        FeatureAccordionBlock,
        StepsBlock,
        TimelineBlock,
        TabsBlock,
        MetricsBlock,
        BigQuoteBlock,
        MiniPricingBlock,
        StrategyFormBlock,
        StickyCtaBlock,
        BonusBannerBlock,
      ],
    },
    {
      name: 'content',
      type: 'richText',
      editor: contentEditor,
      localized: true,
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
    jsonLdOverrideField,
    // SEO `meta` group (title/description/image, all localized) is injected by
    // @payloadcms/plugin-seo — see src/payload.config.ts. Replaces the old manual
    // `seo` group so there is a single source of truth for meta.
  ],
}
