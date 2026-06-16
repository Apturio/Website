import type { HeroCenteredBlock } from '@/payload-types'
import { HeroHead } from '../_shared/HeroHead'

export function HeroCenteredBlockComponent({ block }: { block: HeroCenteredBlock; lang: string }) {
  return (
    <div className="svc">
      <header className="s-hero hero-centered">
        <div className="wrap inner">
          <HeroHead block={block} />
        </div>
      </header>
    </div>
  )
}
