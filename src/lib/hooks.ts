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
 * Resolve a `relatedLocale` relationship to its `{ lang, slug }`. The field may
 * arrive as a populated object (when depth > 0) or as a bare ID (depth 0). When
 * it is an ID we fetch the counterpart via the Local API (in-process, no HTTP).
 * Returns null when it cannot be resolved — callers simply skip that locale.
 */
async function resolveRelatedLangSlug(
  related: unknown,
  collection: 'posts' | 'pages',
  payload: Payload,
): Promise<{ lang: string; slug: string } | null> {
  if (related == null) return null

  let id: string | number | null = null

  if (typeof related === 'object') {
    const r = related as Record<string, unknown>
    if (typeof r.lang === 'string' && typeof r.slug === 'string') {
      return { lang: r.lang, slug: r.slug }
    }
    if (typeof r.id === 'string' || typeof r.id === 'number') id = r.id
  } else if (typeof related === 'string' || typeof related === 'number') {
    id = related
  }

  if (id == null) return null

  try {
    const doc = (await payload.findByID({ collection, id, depth: 0 })) as unknown as
      | Record<string, unknown>
      | null
    if (doc && typeof doc.lang === 'string' && typeof doc.slug === 'string') {
      return { lang: doc.lang, slug: doc.slug }
    }
  } catch {
    // Counterpart missing/unreadable — skip it (do not throw).
  }
  return null
}

/**
 * afterChange (Posts) — on save/publish, invalidate the post's localized URL,
 * the blog index, and the sitemap so edits go live without a redeploy. When a
 * `relatedLocale` counterpart exists, its URL + blog index are revalidated too
 * so BOTH language variants update together (avoids stale ES after EN edit, and
 * vice versa). Wrapped in `safeRevalidate` so seed/migrate never crash.
 */
export const revalidatePostPaths: CollectionAfterChangeHook = async ({ doc, req }) => {
  if (!doc) return doc

  const lang = typeof doc.lang === 'string' ? doc.lang : undefined
  const slug = typeof doc.slug === 'string' ? doc.slug : undefined

  if (lang && slug) {
    safeRevalidate(`/${lang}/blog/${slug}`)
    safeRevalidate(`/${lang}/blog`)
  }

  const related = await resolveRelatedLangSlug(doc.relatedLocale, 'posts', req.payload)
  if (related) {
    safeRevalidate(`/${related.lang}/blog/${related.slug}`)
    safeRevalidate(`/${related.lang}/blog`)
  }

  safeRevalidate('/sitemap.xml')
  return doc
}

// Slugs that map to the locale root (`/en`, `/es`) rather than `/en/<slug>`.
const HOME_MARKER_SLUGS = new Set(['home', 'index', ''])

/**
 * afterChange (Pages) — invalidate the page's localized URL (or the locale root
 * when the slug is a home marker) and the sitemap. Wrapped in `safeRevalidate`
 * so seed/migrate never crash.
 */
export const revalidatePagePaths: CollectionAfterChangeHook = async ({ doc }) => {
  if (!doc) return doc

  const lang = typeof doc.lang === 'string' ? doc.lang : undefined
  const slug = typeof doc.slug === 'string' ? doc.slug : undefined

  if (lang && slug != null) {
    if (HOME_MARKER_SLUGS.has(slug)) {
      safeRevalidate(`/${lang}`)
    } else {
      safeRevalidate(`/${lang}/${slug}`)
    }
  }

  safeRevalidate('/sitemap.xml')
  return doc
}
