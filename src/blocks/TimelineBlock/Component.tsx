import type { TimelineBlock } from '@/payload-types'
import { Icon } from '../_shared/Icon'

export function TimelineBlockComponent({ block }: { block: TimelineBlock; lang: string }) {
  return (
    <div className="svc">
      <section className="sec glow-top">
        <div className="wrap">
          <div className="sec-head">
            {block.eyebrow ? <span className="eyebrow">{block.eyebrow}</span> : null}
            <h2>{block.heading}</h2>
          </div>
          <div className="timeline">
            {(block.items ?? []).map((it, i) => (
              <div className="tl-item" key={it.id ?? i}>
                <span className="dot">
                  <Icon name={it.icon ?? undefined} />
                </span>
                {it.tag ? <span className="tag">{it.tag}</span> : null}
                <h3>{it.title}</h3>
                <p>{it.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
