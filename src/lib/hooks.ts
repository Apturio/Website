import type { CollectionBeforeValidateHook, CollectionBeforeChangeHook } from 'payload'

import { slugify } from '@/lib/slugify'

/**
 * beforeValidate — auto-generate `slug` from `title` (or `name`/`question`) when
 * the slug is empty. The slug stays editable; we only fill the gap.
 */
export const autoSlug =
  (sourceField = 'title'): CollectionBeforeValidateHook =>
  ({ data }) => {
    if (!data) return data
    if (!data.slug && data[sourceField]) {
      data.slug = slugify(String(data[sourceField]))
    }
    return data
  }

/**
 * Walk a Lexical editor state and accumulate plain-text word count. Handles the
 * default rich-text node shapes plus our custom blocks (callout text, CTA body).
 */
function countWordsInLexical(node: unknown): number {
  if (!node || typeof node !== 'object') return 0
  const n = node as Record<string, unknown>
  let words = 0

  if (typeof n.text === 'string' && n.text.trim()) {
    words += n.text.trim().split(/\s+/).length
  }

  // Custom block fields that carry copy (Callout.text richText, CTA body/heading).
  if (n.type === 'block' && n.fields && typeof n.fields === 'object') {
    const f = n.fields as Record<string, unknown>
    for (const key of ['heading', 'body', 'label']) {
      if (typeof f[key] === 'string' && (f[key] as string).trim()) {
        words += (f[key] as string).trim().split(/\s+/).length
      }
    }
    if (f.text) words += countWordsInLexical(f.text)
  }

  if (Array.isArray(n.children)) {
    for (const child of n.children) words += countWordsInLexical(child)
  }
  if (n.root) words += countWordsInLexical(n.root)

  return words
}

const WORDS_PER_MINUTE = 200

/**
 * beforeChange — compute `readTime` (minutes) from the `content` Lexical field.
 * Always at least 1 minute when there is content.
 */
export const computeReadTime: CollectionBeforeChangeHook = ({ data }) => {
  if (!data) return data
  if (data.content) {
    const words = countWordsInLexical(data.content)
    data.readTime = words > 0 ? Math.max(1, Math.round(words / WORDS_PER_MINUTE)) : 0
  }
  return data
}

/**
 * beforeValidate — non-fatal warning when a Post is published without a
 * `relatedLocale` counterpart. hreflang is incomplete until the pair is linked
 * (Phase 9 consumes relatedLocale for alternates). We only warn; we never block.
 */
export const warnMissingRelatedLocale: CollectionBeforeValidateHook = ({ data }) => {
  if (!data) return data
  const isPublished = data._status === 'published' || data.status === 'published'
  if (isPublished && !data.relatedLocale) {
    // eslint-disable-next-line no-console
    console.warn(
      `[Payload] "${data.title ?? data.slug ?? 'document'}" published without relatedLocale — hreflang will be incomplete until the EN/ES pair is linked.`,
    )
  }
  return data
}
