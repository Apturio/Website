'use client'

import { useState } from 'react'

import { NEWSLETTER_FORM_TITLE, isValidEmail, submitFormByTitle } from '@/lib/forms'

interface NewsletterFormProps {
  placeholder: string
  submitLabel: string
  successLabel: string
  errorLabel: string
}

/**
 * Client newsletter capture. POSTs the email to the seeded "Newsletter" form via
 * /api/form-submissions. Labels are passed in already-localized from the server
 * component so the blog i18n stays the single source for user-facing copy.
 */
export function NewsletterForm({
  placeholder,
  submitLabel,
  successLabel,
  errorLabel,
}: NewsletterFormProps) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    if (!isValidEmail(email)) {
      setError(errorLabel)
      return
    }
    setSubmitting(true)
    try {
      await submitFormByTitle(NEWSLETTER_FORM_TITLE, { email: email.trim() })
      setSubmitted(true)
    } catch {
      setError(errorLabel)
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <p className="fine" role="status" style={{ color: 'var(--green-300)' }}>
        {successLabel}
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        className="fld"
        type="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={placeholder}
        required
        style={{ marginBottom: 10 }}
      />
      <button type="submit" className="btn btn-primary btn-block btn-pill" disabled={submitting}>
        {submitting ? '…' : submitLabel}
      </button>
      {error ? (
        <p className="fine" role="alert" style={{ color: 'var(--red-300, #f87171)', marginTop: 8 }}>
          {error}
        </p>
      ) : null}
    </form>
  )
}
