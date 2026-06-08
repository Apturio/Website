import { AdvantageCTA } from '@/components/AdvantageCTA'
import type { CtaBlock } from '@/payload-types'

// Final conversion band. Sits directly above the (advantage-less) footer on the
// home page, reproducing the original Footer top region: a card-coloured band
// with a top border and pt-16, then the advantage card with mb-16.
export function CtaBlockComponent({ block }: { block: CtaBlock; lang: string }) {
  return (
    <section className="border-t border-border bg-card pt-16">
      <div className="container mx-auto px-4">
        <AdvantageCTA
          badge={block.badge}
          title={block.heading}
          body={block.body}
          goal={block.goal}
          safety={block.safety}
          cancelAnytime={block.cancelAnytime}
          buttonLabel={block.buttonLabel}
          buttonHref={block.buttonHref}
        />
      </div>
    </section>
  )
}
