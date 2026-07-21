import type {
  CollectionBeforeValidateHook,
  CollectionBeforeChangeHook,
  CollectionAfterChangeHook,
  GlobalAfterChangeHook,
  Payload,
} from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

import { routing } from '@/i18n/routing'
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
export function countWordsInLexical(node: unknown): number {
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
  collection: 'posts' | 'pages' | 'categories',
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
 * Read a relationship value that may arrive populated (`{ id, ... }`) or as a bare
 * id (depth 0). Returns the id, or `null` when the relation is unset/unreadable.
 */
function relationId(value: unknown): string | number | null {
  if (value == null) return null
  if (typeof value === 'object') {
    const id = (value as Record<string, unknown>).id
    return typeof id === 'string' || typeof id === 'number' ? id : null
  }
  if (typeof value === 'string' || typeof value === 'number') return value
  return null
}

/**
 * Read a single (NON-localized) `slug` string for a document — used for Authors,
 * whose slug is shared across locales. Returns `null` when unreadable/missing.
 */
async function getSingleSlug(
  collection: 'authors',
  id: string | number,
  payload: Payload,
): Promise<string | null> {
  try {
    const doc = (await payload.findByID({
      collection,
      id,
      depth: 0,
    })) as unknown as Record<string, unknown> | null
    const slug = doc?.slug
    return typeof slug === 'string' && slug ? slug : null
  } catch {
    return null
  }
}

/**
 * afterChange (Posts) — on save/publish, invalidate BOTH locales' localized URLs
 * for this one document (using each locale's stored slug), both blog indexes, and
 * the sitemap so edits go live without a redeploy.
 *
 * SCHEMA-18: the category + author pages now emit CollectionPage / ProfilePage
 * schema, so a published post must ALSO refresh those schema-bearing paths per
 * locale (preferred over the 1h ISR window — afterChange freshness on
 * schema-bearing paths). Category slugs are localized (per-locale map); author
 * slugs are NOT (one slug shared across every locale). Everything stays inside
 * `safeRevalidate` so seed/migrate never crash.
 */
export const revalidatePostPaths: CollectionAfterChangeHook = async ({ doc, req }) => {
  if (!doc) return doc

  const slugs = await getLocalizedSlugs('posts', doc.id as string | number, req.payload)

  // Resolve the changed post's category + author relations once (skip cleanly
  // when unset), then map each to its schema-bearing path inside the locale loop.
  const catId = relationId(doc.category)
  const authorId = relationId(doc.author)
  const catSlugs = catId ? await getLocalizedSlugs('categories', catId, req.payload) : {}
  const authorSlug = authorId ? await getSingleSlug('authors', authorId, req.payload) : null

  // The post's OWN localized URLs + blog index, keyed off the post's slug map.
  for (const [locale, slug] of Object.entries(slugs)) {
    safeRevalidate(`/${locale}/blog/${slug}`)
    safeRevalidate(`/${locale}/blog`)
  }

  // Category + author LISTING revalidation is decoupled from the post's slug map
  // (WR-03): a listing page can exist in a locale where THIS post has no slug, so
  // keying off `slugs` would silently skip it and serve stale schema until the 1h
  // ISR fallback. Category slugs are localized (revalidate every locale present in
  // the category's own slug map); author slugs are shared across locales (revalidate
  // the one shared path for every routing locale).
  for (const [locale, catSlug] of Object.entries(catSlugs)) {
    if (catSlug) safeRevalidate(`/${locale}/blog/category/${catSlug}`)
  }
  if (authorSlug) {
    for (const locale of routing.locales) {
      safeRevalidate(`/${locale}/blog/author/${authorSlug}`)
    }
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

// ---------- afterChange: Navigation Global revalidation (Phase 23) ----------

/**
 * Call `revalidateTag` defensively. Like `revalidatePath`, `revalidateTag` throws
 * when invoked outside a Next.js request/render scope — e.g. during
 * `payload run src/seed-navigation.ts` or `payload migrate` — so we swallow that
 * error to keep seed/migration from crashing. The `'max'` profile is Next.js
 * 16's replacement for the old single-argument call — required since Next
 * 16.2 — but it is stale-while-revalidate, NOT an immediate on-demand purge:
 * per Next's own docs, marking the tag stale does not itself trigger
 * revalidation; the *first* visitor after this call is served the stale
 * (pre-change) content while a background refetch happens, and only
 * subsequent visitors see the fresh navigation. If truly-immediate
 * invalidation is ever required, use `revalidateTag(tag, { expire: 0 })`
 * instead, weighing the tradeoff against SWR's benefit on high-traffic paths.
 */
function safeRevalidateTag(tag: string): void {
  try {
    revalidateTag(tag, 'max')
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(
      `[Payload] revalidateTag("${tag}") skipped (outside request scope): ${
        err instanceof Error ? err.message : String(err)
      }`,
    )
  }
}

/**
 * afterChange (Navigation Global) — on save/publish, invalidate the single
 * site-wide `navigation` cache tag so Navbar/Footer refetch without waiting
 * for a redeploy. The Global has no per-locale or per-path structure worth
 * branching on (NAVCMS-06) — one tag covers the whole site.
 */
export const revalidateNavigation: GlobalAfterChangeHook = ({ doc }) => {
  safeRevalidateTag('navigation')
  return doc
}
