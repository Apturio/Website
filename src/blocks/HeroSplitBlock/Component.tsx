import type { HeroSplitBlock } from '@/payload-types'
import { HeroHead } from '../_shared/HeroHead'
import { ImageSlot } from '../_shared/ImageSlot'

export function HeroSplitBlockComponent({ block }: { block: HeroSplitBlock; lang: string }) {
  return (
    <div className="svc">
      <header className="s-hero hero-split">
        <div className="wrap inner">
          <div className="copy">
            <HeroHead block={block} />
          </div>
          <div className="media">
            <ImageSlot image={block.image} placeholder={block.placeholder} />
          </div>
        </div>
      </header>
    </div>
  )
}
