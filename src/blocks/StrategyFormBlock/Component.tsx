'use client'

import { useState } from 'react'
import type { StrategyFormBlock } from '@/payload-types'
import { Icon } from '../_shared/Icon'

const DEFAULT_LEADS = ['Under 100', '100–500', '500–2,000', '2,000+']

export function StrategyFormBlockComponent({ block }: { block: StrategyFormBlock; lang: string }) {
  const [submitted, setSubmitted] = useState(false)
  const l = block.labels ?? {}
  const leadOptions =
    block.leadOptions && block.leadOptions.length > 0
      ? block.leadOptions.map((o) => o.text)
      : DEFAULT_LEADS

  return (
    <div className="svc">
      <section className="sec tight">
        <div className="wrap">
          <div className="strat">
            <div className="copy">
              {block.eyebrow ? <span className="eyebrow">{block.eyebrow}</span> : null}
              <h2>{block.heading}</h2>
              {block.body ? <p>{block.body}</p> : null}
              {block.bullets && block.bullets.length > 0 ? (
                <ul>
                  {block.bullets.map((b, i) => (
                    <li key={i}>
                      <Icon name="check" />
                      <span>{b.text}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
            <form
              className="strat-form"
              // Static stub — no backend wiring in this wave. Capture is a no-op
              // success state; replace with a real POST handler later.
              onSubmit={(e) => {
                e.preventDefault()
                setSubmitted(true)
              }}
            >
              {submitted ? (
                <p className="fine" role="status" style={{ fontSize: 15, color: 'var(--green-300)' }}>
                  {l.success ?? "Thanks — we'll be in touch."}
                </p>
              ) : (
                <>
                  <div className="frow grid2">
                    <div>
                      <label>{l.name ?? 'Full name'}</label>
                      <input className="fld" placeholder={l.namePlaceholder ?? ''} />
                    </div>
                    <div>
                      <label>{l.company ?? 'Company'}</label>
                      <input className="fld" placeholder={l.companyPlaceholder ?? ''} />
                    </div>
                  </div>
                  <div className="frow">
                    <label>{l.email ?? 'Work email'}</label>
                    <input className="fld" type="email" placeholder={l.emailPlaceholder ?? ''} />
                  </div>
                  <div className="frow">
                    <label>{l.leads ?? 'Monthly leads'}</label>
                    <select className="fld">
                      {leadOptions.map((o, i) => (
                        <option key={i}>{o}</option>
                      ))}
                    </select>
                  </div>
                  <button className="btn btn-primary btn-block btn-lg btn-pill submit" type="submit">
                    {l.submit ?? 'Request my call'}
                  </button>
                  <p className="fine">{l.fine ?? ''}</p>
                </>
              )}
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
