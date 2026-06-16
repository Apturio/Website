/**
 * Client-safe helpers for the @payloadcms/plugin-form-builder REST API.
 *
 * Forms are public-readable and form-submissions are public-creatable (plugin
 * defaults), so the browser can look a form up by its stable title and POST a
 * submission directly. Field `name`s here MUST match the names seeded in
 * src/seed.ts (seedForms).
 */

export const STRATEGY_FORM_TITLE = 'Strategy Call'
export const NEWSLETTER_FORM_TITLE = 'Newsletter'

export interface SubmissionValues {
  [field: string]: string | undefined
}

/** Resolve a form id by its (stable, non-localized) title. */
async function resolveFormId(title: string): Promise<string | number | null> {
  const res = await fetch(
    `/api/forms?where[title][equals]=${encodeURIComponent(title)}&limit=1&depth=0`,
    { headers: { 'Content-Type': 'application/json' } },
  )
  if (!res.ok) return null
  const json = (await res.json()) as { docs?: Array<{ id: string | number }> }
  return json.docs?.[0]?.id ?? null
}

/**
 * Submit a form-builder submission. Looks the form up by title, drops empty
 * values, and POSTs to /api/form-submissions in the shape the plugin expects:
 * `{ form, submissionData: [{ field, value }] }`. Throws on failure.
 */
export async function submitFormByTitle(
  title: string,
  values: SubmissionValues,
): Promise<void> {
  const formId = await resolveFormId(title)
  if (!formId) throw new Error(`Form "${title}" not found`)

  const submissionData = Object.entries(values)
    .filter(([, v]) => typeof v === 'string' && v.trim() !== '')
    .map(([field, value]) => ({ field, value: value as string }))

  const res = await fetch('/api/form-submissions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ form: formId, submissionData }),
  })

  if (!res.ok) {
    const err = (await res.json().catch(() => null)) as
      | { errors?: Array<{ message?: string }> }
      | null
    throw new Error(err?.errors?.[0]?.message ?? 'Submission failed')
  }
}

/** Minimal email shape check for client-side validation. */
export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}
