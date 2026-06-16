import type { BonusBannerBlock } from '@/payload-types'

export function BonusBannerBlockComponent({ block }: { block: BonusBannerBlock; lang: string }) {
  return (
    <div className="svc">
      <section className="sec">
        <div className="wrap">
          <div className="cta-bonus">
            <div className="inner">
              {block.pillText ? (
                <span className="pill-green">
                  <span className="dot" />
                  <span>{block.pillText}</span>
                </span>
              ) : null}
              <h2>{block.heading}</h2>
              {block.body ? <p>{block.body}</p> : null}
              {(block.ctaPrimaryLabel || block.ctaSecondaryLabel) && (
                <div className="acts">
                  {block.ctaPrimaryLabel ? (
                    <a href={block.ctaPrimaryHref ?? '#strategy'} className="btn btn-primary btn-lg btn-pill">
                      {block.ctaPrimaryLabel}
                    </a>
                  ) : null}
                  {block.ctaSecondaryLabel ? (
                    <a href={block.ctaSecondaryHref ?? '#strategy'} className="btn btn-dark btn-lg btn-pill">
                      {block.ctaSecondaryLabel}
                    </a>
                  ) : null}
                </div>
              )}
              {block.fine ? <p className="fine">{block.fine}</p> : null}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
