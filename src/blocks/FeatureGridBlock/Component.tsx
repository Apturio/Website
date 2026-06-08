import type { FeatureGridBlock } from '@/payload-types'
import { Icon } from '../_shared/Icon'

export function FeatureGridBlockComponent({ block }: { block: FeatureGridBlock; lang: string }) {
  return (
    <div className="svc">
      <section className="sec glow-top">
        <div className="wrap">
          {block.splitIntro ? (
            <div className="split-intro">
              <div>
                {block.eyebrow ? <span className="eyebrow">{block.eyebrow}</span> : null}
                <h2>{block.heading}</h2>
              </div>
              {block.subtitle ? <p>{block.subtitle}</p> : null}
            </div>
          ) : (
            <div className="sec-head">
              {block.eyebrow ? <span className="eyebrow">{block.eyebrow}</span> : null}
              <h2>{block.heading}</h2>
              {block.subtitle ? <p>{block.subtitle}</p> : null}
            </div>
          )}
          <div className="feat-grid">
            {(block.cards ?? []).map((c, i) => (
              <div className="feat-card" key={c.id ?? i}>
                <div className="ic">
                  <Icon name={c.icon ?? undefined} />
                </div>
                <h3>{c.title}</h3>
                <p>{c.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
