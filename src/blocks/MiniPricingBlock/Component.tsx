import type { MiniPricingBlock } from '@/payload-types'
import { Icon } from '../_shared/Icon'

type Plan = NonNullable<MiniPricingBlock['plans']>[number]

function PlanCard({ p }: { p: Plan }) {
  return (
    <div className={`plan${p.featured ? ' featured' : ''}`}>
      {p.featured && p.bonusTag ? <span className="bonus-tag">{p.bonusTag}</span> : null}
      <div className="pname">{p.name}</div>
      {p.sub ? <div className="psub">{p.sub}</div> : null}
      <div className="price">
        {p.price}
        {p.period ? <small>{p.period}</small> : null}
      </div>
      <ul>
        {(p.features ?? []).map((f, i) => (
          <li className={f.hot ? 'hot' : undefined} key={i}>
            <Icon name="check" className="ck" />
            <span>{f.text}</span>
          </li>
        ))}
      </ul>
      <a
        href={p.ctaHref ?? '#strategy'}
        className={`btn ${p.featured ? 'btn-primary' : 'btn-dark'} btn-block btn-pill`}
      >
        {p.ctaLabel}
      </a>
    </div>
  )
}

export function MiniPricingBlockComponent({ block }: { block: MiniPricingBlock; lang: string }) {
  const plans = block.plans ?? []
  const single = block.single
  const shown = single ? plans.filter((p) => p.featured).slice(0, 1) : plans

  return (
    <div className="svc">
      <section className="sec glow-top">
        <div className="wrap">
          {(block.eyebrow || block.heading || block.subtitle) && (
            <div className="sec-head">
              {block.eyebrow ? <span className="eyebrow">{block.eyebrow}</span> : null}
              {block.heading ? <h2>{block.heading}</h2> : null}
              {block.subtitle ? <p>{block.subtitle}</p> : null}
            </div>
          )}
          <div className={single ? 'pricing-single' : undefined}>
            <div className="pricing-spot">
              {shown.map((p, i) => (
                <PlanCard p={p} key={p.id ?? i} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
