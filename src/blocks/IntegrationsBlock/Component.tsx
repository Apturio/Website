import type { IntegrationsBlock } from '@/payload-types'
import type { Media } from '@/payload-types'

export function IntegrationsBlockComponent({ block }: { block: IntegrationsBlock; lang: string }) {
  return (
    <div className="svc">
      <section className="sec glow-top">
        <div className="wrap">
          <div className="sec-head">
            {block.eyebrow ? <span className="eyebrow">{block.eyebrow}</span> : null}
            <h2>{block.heading}</h2>
            {block.subtitle ? <p>{block.subtitle}</p> : null}
          </div>
          <div className="feat-grid">
            {(block.items ?? []).map((it, i) => {
              const logo = typeof it.logo === 'object' && it.logo ? (it.logo as Media) : null
              const card = (
                <div className="feat-card" key={it.id ?? i}>
                  <div className="ic">
                    {logo?.url ? <img src={logo.url} alt={logo.alt ?? it.name} /> : null}
                  </div>
                  <h3>{it.name}</h3>
                  <p>{it.description}</p>
                </div>
              )
              return it.href ? (
                <a href={it.href} key={it.id ?? i} className="feat-card-link">
                  {card}
                </a>
              ) : (
                card
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
