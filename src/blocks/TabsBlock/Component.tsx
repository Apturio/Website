'use client'

import { useState } from 'react'
import type { TabsBlock } from '@/payload-types'
import { Icon } from '../_shared/Icon'
import { ImageSlot } from '../_shared/ImageSlot'

export function TabsBlockComponent({ block }: { block: TabsBlock; lang: string }) {
  const [active, setActive] = useState(0)
  const tabs = block.tabs ?? []

  return (
    <div className="svc">
      <section className="sec glow-top">
        <div className="wrap">
          <div className="sec-head">
            {block.eyebrow ? <span className="eyebrow">{block.eyebrow}</span> : null}
            <h2>{block.heading}</h2>
          </div>
          <div className="tabs">
            <div className="tab-nav">
              {tabs.map((t, i) => (
                <button
                  type="button"
                  className={`tab-btn${active === i ? ' on' : ''}`}
                  key={t.id ?? i}
                  onClick={() => setActive(i)}
                >
                  <Icon name={t.icon ?? undefined} />
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
            {tabs.map((t, i) => (
              <div className={`tab-panel${active === i ? ' on' : ''}`} key={t.id ?? i}>
                <div>
                  <h3>{t.title}</h3>
                  <p>{t.description}</p>
                  {t.bullets && t.bullets.length > 0 ? (
                    <ul>
                      {t.bullets.map((b, j) => (
                        <li key={j}>
                          <Icon name="check" />
                          <span>{b.text}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
                <ImageSlot image={t.image} placeholder={t.placeholder} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
