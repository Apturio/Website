import type { StepsBlock } from '@/payload-types'
import { Icon } from '../_shared/Icon'

export function StepsBlockComponent({ block }: { block: StepsBlock; lang: string }) {
  const items = block.items ?? []
  return (
    <div className="svc">
      <section className="sec tight">
        <div className="wrap">
          <div className="sec-head">
            {block.eyebrow ? <span className="eyebrow">{block.eyebrow}</span> : null}
            <h2>{block.heading}</h2>
          </div>
          <div className="steps">
            {items.map((s, i) => (
              <div className="step" key={s.id ?? i}>
                <div className="n" />
                <h3>{s.title}</h3>
                <p>{s.description}</p>
                {i < items.length - 1 ? <Icon name="chevron-right" className="arr" /> : null}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
