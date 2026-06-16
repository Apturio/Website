'use client'

import { useEffect, useState } from 'react'

import type { TocHeading } from '@/lib/blog'

/**
 * Sticky table of contents with IntersectionObserver scroll-spy. Heading ids are
 * injected by the Lexical heading converter (slugify(text)) so the anchors here
 * resolve to real elements in the rendered article.
 */
export function TOC({ headings, title }: { headings: TocHeading[]; title: string }) {
  const [active, setActive] = useState<string>(headings[0]?.id ?? '')

  useEffect(() => {
    if (headings.length === 0) return
    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null)

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]?.target?.id) setActive(visible[0].target.id)
      },
      { rootMargin: '-96px 0px -65% 0px', threshold: 0 },
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  return (
    <nav className="toc">
      <h4>{title}</h4>
      {headings.map((h) => (
        <a
          key={h.id}
          href={`#${h.id}`}
          className={active === h.id ? 'on' : undefined}
          style={h.level === 3 ? { paddingLeft: 28 } : undefined}
        >
          {h.text}
        </a>
      ))}
    </nav>
  )
}
