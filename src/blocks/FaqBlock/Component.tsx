import { FAQ } from '@/components/FAQ'
import type { FaqBlock } from '@/payload-types'

// Server wrapper maps the block's {question, answer} items into the client
// <FAQ> accordion's {q, a} shape and passes the locale across the boundary.
export function FaqBlockComponent({ block, lang }: { block: FaqBlock; lang: string }) {
  const items = (block.items ?? []).map((i) => ({ q: i.question, a: i.answer }))
  return <FAQ heading={block.heading} items={items} lang={lang} />
}
