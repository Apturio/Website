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

// Click-to-chat number used across the site (Organization contactPoint, seeds).
const WHATSAPP_URL = 'https://wa.me/15614731298'

/** Collapses the stray double spaces editors leave at the edges of the headline parts. */
const tidy = (v?: string | null) => (v ?? '').replace(/\s+/g, ' ').trim()

/**
 * An empty or `#` secondary link never goes anywhere. A WhatsApp-labelled CTA falls back to
 * the WhatsApp chat; any other secondary CTA without a destination is not rendered.
 */
function resolveSecondaryHref(label?: string | null, href?: string | null): string | null {
  const h = href?.trim()
  if (h && h !== '#') return h
  return label && /whatsapp/i.test(label) ? WHATSAPP_URL : null
}

/** Shared hero head: pill + split-accent headline + sub + CTAs + micro row. */
export function HeroHead({ block }: { block: HeroHeadProps }) {
  const accentClass = block.accentColor === 'green' ? 'green' : 'accent'
  const secondaryHref = resolveSecondaryHref(block.ctaSecondaryLabel, block.ctaSecondaryHref)
  return (
    <>
      {block.pillText ? (
        <span className="feat-pill">
          <Icon name={block.pillIcon ?? undefined} />
          <span>{block.pillText}</span>
        </span>
      ) : null}
      <h1>
        {tidy(block.titleStart)}
        {block.titleAccent ? (
          <>
            {' '}
            <span className={accentClass}>{tidy(block.titleAccent)}</span>
          </>
        ) : null}
        {block.titleEnd ? ` ${tidy(block.titleEnd)}` : null}
      </h1>
      {block.subtitle ? <p className="sub">{block.subtitle}</p> : null}
      {(block.ctaPrimaryLabel || block.ctaSecondaryLabel) && (
        <div className="acts">
          {block.ctaPrimaryLabel ? (
            <a href={block.ctaPrimaryHref ?? '#'} className="btn btn-primary btn-lg btn-pill">
              {block.ctaPrimaryLabel}
            </a>
          ) : null}
          {block.ctaSecondaryLabel && secondaryHref ? (
            <a href={secondaryHref} className="btn btn-dark btn-lg btn-pill">
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
