'use client'

import { useState } from 'react'
import type { FeatureAccordionBlock } from '@/payload-types'
import { Icon } from '../_shared/Icon'
import { ImageSlot } from '../_shared/ImageSlot'

export function FeatureAccordionBlockComponent({
  block,
}: {
  block: FeatureAccordionBlock
  lang: string
}) {
  // First item open by default, exactly like the prototype (.acc.open).
  const [open, setOpen] = useState(0)
  const items = block.items ?? []

  return (
    <div className="svc">
      <section className="sec">
        <div className="wrap">
          <div className="sec-head">
            {block.eyebrow ? <span className="eyebrow">{block.eyebrow}</span> : null}
            <h2>{block.heading}</h2>
          </div>
          <div className="acc-layout">
            <div className="acc-media">
              <ImageSlot image={block.image} placeholder={block.placeholder} />
            </div>
            <div className="acc-list">
              {items.map((it, i) => {
                const isOpen = open === i
                return (
                  <div className={`acc${isOpen ? ' open' : ''}`} key={it.id ?? i}>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpen(isOpen ? -1 : i)}
                    >
                      <span className="ai">
                        <Icon name={it.icon ?? undefined} />
                      </span>
                      <span>{it.title}</span>
                      <Icon name="chevron-down" className="chev" />
                    </button>
                    <div className="panel">
                      <p>{it.body}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
