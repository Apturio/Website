'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export interface FilterChip {
  /** category slug, or 'all' */
  value: string
  label: string
  /** when set, the chip is a link to the category page instead of a filter */
  href?: string
}

/**
 * Category chip row. On the blog index the chips filter the server-rendered card
 * grid client-side (by toggling `hidden` on `[data-blog-card]` elements whose
 * `data-category` does not match). Chips can alternatively be links (category
 * page navigation). Client island; the cards themselves stay Server Components.
 */
export function CategoryFilter({
  chips,
  targetId,
  initialActive = 'all',
  withDot = false,
}: {
  chips: FilterChip[]
  /** id of the grid container whose children carry `data-category` */
  targetId?: string
  initialActive?: string
  withDot?: boolean
}) {
  const [active, setActive] = useState(initialActive)

  useEffect(() => {
    if (!targetId) return
    const grid = document.getElementById(targetId)
    if (!grid) return
    const cards = grid.querySelectorAll<HTMLElement>('[data-blog-card]')
    cards.forEach((card) => {
      const cat = card.getAttribute('data-category') ?? ''
      const show = active === 'all' || cat === active
      if (show) card.removeAttribute('hidden')
      else card.setAttribute('hidden', '')
    })
  }, [active, targetId])

  return (
    <div className="subnav-in">
      {chips.map((chip) =>
        chip.href ? (
          <Link key={chip.value} href={chip.href} className="cat-chip">
            {withDot && <span className="ck" />}
            {chip.label}
          </Link>
        ) : (
          <button
            key={chip.value}
            type="button"
            className={`cat-chip${active === chip.value ? ' on' : ''}`}
            onClick={() => setActive(chip.value)}
          >
            {withDot && chip.value !== 'all' && <span className="ck" />}
            {chip.label}
          </button>
        ),
      )}
    </div>
  )
}
