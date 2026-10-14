'use client'

import { useState } from 'react'
import type { StrategyFormBlock } from '@/payload-types'
import { Icon } from '../_shared/Icon'
import { STRATEGY_FORM_TITLE, isValidEmail, submitFormByTitle } from '@/lib/forms'

// Fallbacks for fields an editor left empty, in the page language (the form used to fall
// back to English on Spanish pages).
const COPY = {
  en: {
    name: 'Full name',
    company: 'Company',
    email: 'Work email',
    leads: 'Monthly leads',
    submit: 'Request my call',
    success: "Thanks — we'll be in touch.",
    errRequired: 'Please enter your name and email.',
    errEmail: 'Please enter a valid email address.',
    errSend: 'Something went wrong. Please try again.',
    leadsPrefix: 'Monthly leads',
    leadOptions: ['Under 100', '100–500', '500–2,000', '2,000+'],
  },
  es: {
    name: 'Nombre completo',
    company: 'Empresa',
    email: 'Correo de trabajo',
    leads: 'Leads al mes',
    submit: 'Solicitar mi llamada',
    success: 'Gracias, te contactaremos pronto.',
    errRequired: 'Ingresa tu nombre y tu correo.',
    errEmail: 'Ingresa un correo válido.',
    errSend: 'Algo salió mal. Inténtalo de nuevo.',
    leadsPrefix: 'Leads al mes',
    leadOptions: ['Menos de 100', '100–500', '500–2.000', '2.000+'],
  },
} as const

// Payload falls back to English when a label was never written in Spanish, so a Spanish page
// can arrive with the stock English strings (the clinic/spa landing forms did). These are the
// exact stock strings from the seeds with their Spanish counterparts; anything an editor
// actually customised passes through untouched.
const ES_STOCK_LABELS: Record<string, string> = {
  'Full name': 'Nombre',
  Company: 'Empresa',
  'Work email': 'Correo de trabajo',
  'Monthly leads': 'Leads mensuales',
  'Request my call': 'Solicitar mi llamada',
  'No commitment · We reply within 1 business day.': 'Sin compromiso · Respondemos en 1 día hábil.',
  "Thanks — we'll be in touch within 1 business day.": 'Gracias — te contactamos en 1 día hábil.',
}

export function StrategyFormBlockComponent({ block, lang }: { block: StrategyFormBlock; lang: string }) {
  const c = lang === 'es' ? COPY.es : COPY.en
  const raw = block.labels ?? {}
  const l = Object.fromEntries(
    Object.entries(raw).map(([k, v]) => [k, lang === 'es' && typeof v === 'string' ? (ES_STOCK_LABELS[v] ?? v) : v]),
  ) as typeof raw
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const leadOptions =
    block.leadOptions && block.leadOptions.length > 0
      ? block.leadOptions.map((o) => o.text)
      : c.leadOptions

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const fd = new FormData(e.currentTarget)
    const name = String(fd.get('name') ?? '').trim()
    const email = String(fd.get('email') ?? '').trim()
    const company = String(fd.get('company') ?? '').trim()
    const leads = String(fd.get('leads') ?? '').trim()

    if (!name || !email) {
      setError(c.errRequired)
      return
    }
    if (!isValidEmail(email)) {
      setError(c.errEmail)
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
        message: leads ? `${c.leadsPrefix}: ${leads}` : undefined,
      })
      setSubmitted(true)
    } catch {
      setError(c.errSend)
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
                  {l.success ?? c.success}
                </p>
              ) : (
                <>
                  <div className="frow grid2">
                    <div>
                      <label>{l.name ?? c.name}</label>
                      <input name="name" className="fld" placeholder={l.namePlaceholder ?? ''} required />
                    </div>
                    <div>
                      <label>{l.company ?? c.company}</label>
                      <input name="company" className="fld" placeholder={l.companyPlaceholder ?? ''} />
                    </div>
                  </div>
                  <div className="frow">
                    <label>{l.email ?? c.email}</label>
                    <input name="email" className="fld" type="email" placeholder={l.emailPlaceholder ?? ''} required />
                  </div>
                  <div className="frow">
                    <label>{l.leads ?? c.leads}</label>
                    <select name="leads" className="fld" aria-label={l.leads ?? c.leads}>
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
                    {submitting ? '…' : l.submit ?? c.submit}
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
