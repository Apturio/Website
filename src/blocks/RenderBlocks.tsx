import type { Page } from '@/payload-types'

import { HeroBlockComponent } from './HeroBlock/Component'
import { LogosBlockComponent } from './LogosBlock/Component'
import { ProblemBlockComponent } from './ProblemBlock/Component'
import { BenefitsBlockComponent } from './BenefitsBlock/Component'
import { TestimonialsBlockComponent } from './TestimonialsBlock/Component'
import { PricingBlockComponent } from './PricingBlock/Component'
import { FaqBlockComponent } from './FaqBlock/Component'
import { CtaBlockComponent } from './CtaBlock/Component'
// Wave 2 — service-page block library
import { HeroCenteredBlockComponent } from './HeroCenteredBlock/Component'
import { HeroSplitBlockComponent } from './HeroSplitBlock/Component'
import { HeroDashboardBlockComponent } from './HeroDashboardBlock/Component'
import { HeroBoldBlockComponent } from './HeroBoldBlock/Component'
import { FeatureGridBlockComponent } from './FeatureGridBlock/Component'
import { FeatureZigzagBlockComponent } from './FeatureZigzagBlock/Component'
import { FeatureAccordionBlockComponent } from './FeatureAccordionBlock/Component'
import { StepsBlockComponent } from './StepsBlock/Component'
import { TimelineBlockComponent } from './TimelineBlock/Component'
import { TabsBlockComponent } from './TabsBlock/Component'
import { MetricsBlockComponent } from './MetricsBlock/Component'
import { BigQuoteBlockComponent } from './BigQuoteBlock/Component'
import { MiniPricingBlockComponent } from './MiniPricingBlock/Component'
import { StrategyFormBlockComponent } from './StrategyFormBlock/Component'
import { StickyCtaBlockComponent } from './StickyCtaBlock/Component'
import { BonusBannerBlockComponent } from './BonusBannerBlock/Component'

type LayoutBlock = NonNullable<Page['layout']>[number]

/**
 * Maps a Page's `layout` array (Payload blocks) to their React components.
 * `blockType` is the discriminant; each case narrows the union so the matching
 * component receives a fully-typed block. Unknown block types render nothing.
 */
export function RenderBlocks({ layout, lang }: { layout?: LayoutBlock[] | null; lang: string }) {
  if (!layout || layout.length === 0) return null

  return (
    <>
      {layout.map((block, i) => {
        const key = block.id ?? `${block.blockType}-${i}`
        switch (block.blockType) {
          case 'hero':
            return <HeroBlockComponent key={key} block={block} lang={lang} />
          case 'logos':
            return <LogosBlockComponent key={key} block={block} lang={lang} />
          case 'problem':
            return <ProblemBlockComponent key={key} block={block} lang={lang} />
          case 'benefits':
            return <BenefitsBlockComponent key={key} block={block} lang={lang} />
          case 'testimonials':
            return <TestimonialsBlockComponent key={key} block={block} lang={lang} />
          case 'pricing':
            return <PricingBlockComponent key={key} block={block} lang={lang} />
          case 'faq':
            return <FaqBlockComponent key={key} block={block} lang={lang} />
          case 'cta':
            return <CtaBlockComponent key={key} block={block} lang={lang} />
          // ---- Wave 2 — service-page blocks ----
          case 'heroCentered':
            return <HeroCenteredBlockComponent key={key} block={block} lang={lang} />
          case 'heroSplit':
            return <HeroSplitBlockComponent key={key} block={block} lang={lang} />
          case 'heroDashboard':
            return <HeroDashboardBlockComponent key={key} block={block} lang={lang} />
          case 'heroBold':
            return <HeroBoldBlockComponent key={key} block={block} lang={lang} />
          case 'featureGrid':
            return <FeatureGridBlockComponent key={key} block={block} lang={lang} />
          case 'featureZigzag':
            return <FeatureZigzagBlockComponent key={key} block={block} lang={lang} />
          case 'featureAccordion':
            return <FeatureAccordionBlockComponent key={key} block={block} lang={lang} />
          case 'steps':
            return <StepsBlockComponent key={key} block={block} lang={lang} />
          case 'timeline':
            return <TimelineBlockComponent key={key} block={block} lang={lang} />
          case 'tabs':
            return <TabsBlockComponent key={key} block={block} lang={lang} />
          case 'metrics':
            return <MetricsBlockComponent key={key} block={block} lang={lang} />
          case 'bigQuote':
            return <BigQuoteBlockComponent key={key} block={block} lang={lang} />
          case 'miniPricing':
            return <MiniPricingBlockComponent key={key} block={block} lang={lang} />
          case 'strategyForm':
            return <StrategyFormBlockComponent key={key} block={block} lang={lang} />
          case 'stickyCta':
            return <StickyCtaBlockComponent key={key} block={block} lang={lang} />
          case 'bonusBanner':
            return <BonusBannerBlockComponent key={key} block={block} lang={lang} />
          default:
            return null
        }
      })}
    </>
  )
}
