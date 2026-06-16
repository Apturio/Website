import { Hero } from '@/components/Hero'
import type { HeroBlock } from '@/payload-types'

export function HeroBlockComponent({ block, lang }: { block: HeroBlock; lang: string }) {
  return <Hero block={block} lang={lang} />
}
