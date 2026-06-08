import type { HeroBoldBlock } from '@/payload-types'
import { HeroHead } from '../_shared/HeroHead'
import { Icon } from '../_shared/Icon'

export function HeroBoldBlockComponent({ block }: { block: HeroBoldBlock; lang: string }) {
  return (
    <div className="svc">
      <header className="s-hero hero-asym">
        <div className="wrap inner">
          <div className="copy">
            <HeroHead block={block} />
          </div>
          <div className="stack">
            {(block.cards ?? []).map((c, i) => (
              <div className={`float-card${c.green ? ' green' : ''}`} key={c.id ?? i}>
                <div className="ic">
                  <Icon name={c.icon ?? undefined} />
                </div>
                <div>
                  <div className="big">{c.big}</div>
                  <div className="lbl">{c.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>
    </div>
  )
}
