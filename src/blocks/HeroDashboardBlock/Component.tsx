import type { HeroDashboardBlock } from '@/payload-types'
import { HeroHead } from '../_shared/HeroHead'
import { ImageSlot } from '../_shared/ImageSlot'

export function HeroDashboardBlockComponent({ block }: { block: HeroDashboardBlock; lang: string }) {
  return (
    <div className="svc">
      <header className="s-hero hero-dash">
        <div className="wrap inner">
          <HeroHead block={block} />
        </div>
        <div className="wrap">
          <div className="shot">
            <ImageSlot image={block.image} placeholder={block.placeholder} />
          </div>
        </div>
      </header>
    </div>
  )
}
