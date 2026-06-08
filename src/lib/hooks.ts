import type {
  CollectionBeforeValidateHook,
  CollectionBeforeChangeHook,
  CollectionAfterChangeHook,
  Payload,
} from 'payload'
import { revalidatePath } from 'next/cache'

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

// ---------- afterChange: ISR revalidation (Phase 10) ----------

/**
 * Call `revalidatePath` defensively. `revalidatePath` throws when invoked
 * outside a Next.js request/render scope — e.g. during `payload run src/seed.ts`
 * or `payload migrate`, where the static-generation store does not exist. We
 * swallow that error so seed/migration never crash; the ISR time-based fallback
 * (`revalidate: 3600`) still refreshes content in those cases.
 *
 * NOTE: `revalidatePath` takes the URL PATH (e.g. `/en/blog/foo`), never the
 * filesystem route (`(site)/[lang]/blog/[slug]`). Route groups are invisible.
 */
function safeRevalidate(urlPath: string): void {
  try {
    revalidatePath(urlPath)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(
      `[Payload] revalidatePath("${urlPath}") skipped (outside request scope): ${
        err instanceof Error ? err.message : String(err)
      }`,
    )
  }
}

/**
 * Read EVERY locale's `slug` for a single document. With native localization a
 * document holds one slug per locale; `locale: 'all'` returns the raw per-locale
 * map (`{ en: 'foo', es: 'bar' }`) with no fallback, so we only emit URLs for
 * locales that actually have a stored slug. Returns `{}` when unreadable.
 */
async function getLocalizedSlugs(
  collection: 'posts' | 'pages',
  id: string | number,
  payload: Payload,
): Promise<Record<string, string>> {
  try {
    const doc = (await payload.findByID({
      collection,
      id,
      locale: 'all',
      depth: 0,
    })) as unknown as Record<string, unknown> | null
    const slug = doc?.slug
    const out: Record<string, string> = {}
    if (slug && typeof slug === 'object') {
      for (const [loc, val] of Object.entries(slug as Record<string, unknown>)) {
        if (typeof val === 'string' && val) out[loc] = val
      }
    }
    return out
  } catch {
    return {}
  }
}

/**
 * afterChange (Posts) — on save/publish, invalidate BOTH locales' localized URLs
 * for this one document (using each locale's stored slug), both blog indexes, and
 * the sitemap so edits go live without a redeploy. Wrapped in `safeRevalidate`
 * so seed/migrate never crash.
 */
export const revalidatePostPaths: CollectionAfterChangeHook = async ({ doc, req }) => {
  if (!doc) return doc

  const slugs = await getLocalizedSlugs('posts', doc.id as string | number, req.payload)
  for (const [locale, slug] of Object.entries(slugs)) {
    safeRevalidate(`/${locale}/blog/${slug}`)
    safeRevalidate(`/${locale}/blog`)
  }

  safeRevalidate('/sitemap.xml')
  return doc
}

// Slugs that map to the locale root (`/en`, `/es`) rather than `/en/<slug>`.
const HOME_MARKER_SLUGS = new Set(['home', 'index', ''])

/**
 * afterChange (Pages) — invalidate BOTH locales' localized URLs (or the locale
 * root when the slug is a home marker) for this one document, plus the sitemap.
 * Wrapped in `safeRevalidate` so seed/migrate never crash.
 */
export const revalidatePagePaths: CollectionAfterChangeHook = async ({ doc, req }) => {
  if (!doc) return doc

  const slugs = await getLocalizedSlugs('pages', doc.id as string | number, req.payload)
  for (const [locale, slug] of Object.entries(slugs)) {
    if (HOME_MARKER_SLUGS.has(slug)) {
      safeRevalidate(`/${locale}`)
    } else {
      safeRevalidate(`/${locale}/${slug}`)
    }
  }

  safeRevalidate('/sitemap.xml')
  return doc
}
