import { Icon } from './Icon'

export interface HeroHeadProps {
  pillIcon?: string | null
  pillText?: string | null
  titleStart?: string | null
  titleAccent?: string | null
  titleEnd?: string | null
  accentColor?: ('brand' | 'green') | null
  subtitle?: string | null
  ctaPrimaryLabel?: string | null
  ctaPrimaryHref?: string | null
  ctaSecondaryIcon?: string | null
  ctaSecondaryLabel?: string | null
  ctaSecondaryHref?: string | null
  micro?: ({ text: string; id?: string | null } | { text?: string | null })[] | null
}

/** Shared hero head: pill + split-accent headline + sub + CTAs + micro row. */
export function HeroHead({ block }: { block: HeroHeadProps }) {
  const accentClass = block.accentColor === 'green' ? 'green' : 'accent'
  return (
    <>
      {block.pillText ? (
        <span className="feat-pill">
          <Icon name={block.pillIcon ?? undefined} />
          <span>{block.pillText}</span>
        </span>
      ) : null}
      <h1>
        {block.titleStart}
        {block.titleAccent ? (
          <>
            {' '}
            <span className={accentClass}>{block.titleAccent}</span>
          </>
        ) : null}
        {block.titleEnd ? ` ${block.titleEnd}` : null}
      </h1>
      {block.subtitle ? <p className="sub">{block.subtitle}</p> : null}
      {(block.ctaPrimaryLabel || block.ctaSecondaryLabel) && (
        <div className="acts">
          {block.ctaPrimaryLabel ? (
            <a href={block.ctaPrimaryHref ?? '#'} className="btn btn-primary btn-lg btn-pill">
              {block.ctaPrimaryLabel}
            </a>
          ) : null}
          {block.ctaSecondaryLabel ? (
            <a href={block.ctaSecondaryHref ?? '#'} className="btn btn-dark btn-lg btn-pill">
              {block.ctaSecondaryIcon ? <Icon name={block.ctaSecondaryIcon} /> : null}
              {block.ctaSecondaryLabel}
            </a>
          ) : null}
        </div>
      )}
      {block.micro && block.micro.length > 0 ? (
        <div className="micro">
          {block.micro.map((m, i) => (
            <span className="it" key={i}>
              <Icon name="check" />
              <span>{m.text}</span>
            </span>
          ))}
        </div>
      ) : null}
    </>
  )
}
