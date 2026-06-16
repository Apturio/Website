'use client'

import { useState } from 'react'
import type { StrategyFormBlock } from '@/payload-types'
import { Icon } from '../_shared/Icon'
import { STRATEGY_FORM_TITLE, isValidEmail, submitFormByTitle } from '@/lib/forms'

const DEFAULT_LEADS = ['Under 100', '100–500', '500–2,000', '2,000+']

export function StrategyFormBlockComponent({ block }: { block: StrategyFormBlock; lang: string }) {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const l = block.labels ?? {}
  const leadOptions =
    block.leadOptions && block.leadOptions.length > 0
      ? block.leadOptions.map((o) => o.text)
      : DEFAULT_LEADS

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const fd = new FormData(e.currentTarget)
    const name = String(fd.get('name') ?? '').trim()
    const email = String(fd.get('email') ?? '').trim()
    const company = String(fd.get('company') ?? '').trim()
    const leads = String(fd.get('leads') ?? '').trim()

    if (!name || !email) {
      setError('Please enter your name and email.')
      return
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.')
      return
    }

    setSubmitting(true)
    try {
      // Strategy Call form fields: name, email, company, message. The monthly-leads
      // select has no free-text field, so it is folded into `message`.
      await submitFormByTitle(STRATEGY_FORM_TITLE, {
        name,
        email,
        company,
        message: leads ? `Monthly leads: ${leads}` : undefined,
      })
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

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
            <form className="strat-form" onSubmit={handleSubmit}>
              {submitted ? (
                <p className="fine" role="status" style={{ fontSize: 15, color: 'var(--green-300)' }}>
                  {l.success ?? "Thanks — we'll be in touch."}
                </p>
              ) : (
                <>
                  <div className="frow grid2">
                    <div>
                      <label>{l.name ?? 'Full name'}</label>
                      <input name="name" className="fld" placeholder={l.namePlaceholder ?? ''} required />
                    </div>
                    <div>
                      <label>{l.company ?? 'Company'}</label>
                      <input name="company" className="fld" placeholder={l.companyPlaceholder ?? ''} />
                    </div>
                  </div>
                  <div className="frow">
                    <label>{l.email ?? 'Work email'}</label>
                    <input name="email" className="fld" type="email" placeholder={l.emailPlaceholder ?? ''} required />
                  </div>
                  <div className="frow">
                    <label>{l.leads ?? 'Monthly leads'}</label>
                    <select name="leads" className="fld">
                      {leadOptions.map((o, i) => (
                        <option key={i}>{o}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    className="btn btn-primary btn-block btn-lg btn-pill submit"
                    type="submit"
                    disabled={submitting}
                  >
                    {submitting ? '…' : l.submit ?? 'Request my call'}
                  </button>
                  {error ? (
                    <p className="fine" role="alert" style={{ color: 'var(--red-300, #f87171)' }}>
                      {error}
                    </p>
                  ) : (
                    <p className="fine">{l.fine ?? ''}</p>
                  )}
                </>
              )}
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
