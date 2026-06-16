'use client'

import { useEffect, useState } from 'react'
import type { StickyCtaBlock } from '@/payload-types'

export function StickyCtaBlockComponent({ block }: { block: StickyCtaBlock; lang: string }) {
  const [show, setShow] = useState(false)
  const [closed, setClosed] = useState(false)

  useEffect(() => {
    if (closed) return
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop
      const max = document.documentElement.scrollHeight - window.innerHeight
      // Show after passing the hero, hide near the very bottom (footer CTA region).
      setShow(y > 620 && y < max - 480)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [closed])

  if (closed) return null

  return (
    <div className="svc">
      <div className={`svc-sticky${show ? ' show' : ''}`}>
        <div className="bar">
          <div className="txt">
            <span className="t">{block.title}</span>
            {block.subtitle ? (
              <>
                <span className="sep" />
                <span className="s">{block.subtitle}</span>
              </>
            ) : null}
          </div>
          <a href={block.ctaHref ?? '#strategy'} className="btn btn-primary btn-pill">
            {block.ctaLabel}
          </a>
          <button
            type="button"
            className="close"
            aria-label="Dismiss"
            onClick={() => setClosed(true)}
          >
            ×
          </button>
        </div>
      </div>
    </div>
  )
}
