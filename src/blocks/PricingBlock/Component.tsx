import { Pricing } from '@/components/Pricing'
import type { PricingBlock } from '@/payload-types'

export function PricingBlockComponent({ block, lang }: { block: PricingBlock; lang: string }) {
  return <Pricing block={block} lang={lang} />
}
