import type { Page } from '@/payload-types'

import { HeroBlockComponent } from './HeroBlock/Component'
import { LogosBlockComponent } from './LogosBlock/Component'
import { ProblemBlockComponent } from './ProblemBlock/Component'
import { BenefitsBlockComponent } from './BenefitsBlock/Component'
import { TestimonialsBlockComponent } from './TestimonialsBlock/Component'
import { PricingBlockComponent } from './PricingBlock/Component'
import { FaqBlockComponent } from './FaqBlock/Component'
import { CtaBlockComponent } from './CtaBlock/Component'

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
          default:
            return null
        }
      })}
    </>
  )
}
