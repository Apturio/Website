import 'server-only'
import { getPayload } from 'payload'
import type { Where } from 'payload'
import config from '@payload-config'

import { slugify } from '@/lib/slugify'
import { docHasLocaleContent, hasLocaleContent } from '@/lib/localized-content'
import type { Post, Category, Author, Media } from '@/payload-types'
import type { AppLocale } from '@/lib/site'

/** Shared local-API Payload instance (singleton in production). */
export async function getPayloadClient() {
  return getPayload({ config })
}

/* ------------------------------------------------------------------ */
/* Relationship type guards (depth>=1 populates to full objects)       */
/* ------------------------------------------------------------------ */
export function asAuthor(v: Post['author']): Author | null {
  return v && typeof v === 'object' ? v : null
}
export function asCategory(v: Post['category']): Category | null {
  return v && typeof v === 'object' ? v : null
}
export function asMedia(v: Post['heroImage'] | undefined): Media | null {
  return v && typeof v === 'object' ? v : null
}

/* ------------------------------------------------------------------ */
/* Formatting                                                          */
/* ------------------------------------------------------------------ */
export function formatDate(date: string | null | undefined, locale: AppLocale): string {
  if (!date) return ''
  return new Intl.DateTimeFormat(locale === 'es' ? 'es-ES' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

export function readTimeLabel(post: Post, locale: AppLocale): string {
  const mins = post.readTime ?? 4
  return locale === 'es' ? `${mins} min de lectura` : `${mins} min read`
}

/* ------------------------------------------------------------------ */
/* TOC heading extraction — MUST mirror the Lexical heading converter   */
/* (both use slugify(text)) so anchors resolve.                         */
/* ------------------------------------------------------------------ */
export interface TocHeading {
  id: string
  text: string
  level: 2 | 3
}

export function lexicalNodeText(node: { text?: string; children?: unknown[] }): string {
  if (typeof node.text === 'string') return node.text
  if (Array.isArray(node.children)) {
    return node.children
      .map((c) => lexicalNodeText(c as { text?: string; children?: unknown[] }))
      .join('')
  }
  return ''
}

export function extractHeadings(content: Post['content']): TocHeading[] {
  const children = content?.root?.children
  if (!Array.isArray(children)) return []
  const out: TocHeading[] = []
  for (const node of children as Array<Record<string, unknown>>) {
    if (node?.type === 'heading' && (node.tag === 'h2' || node.tag === 'h3')) {
      const text = lexicalNodeText(node as { children?: unknown[] }).trim()
      if (!text) continue
      out.push({ id: slugify(text), text, level: node.tag === 'h2' ? 2 : 3 })
    }
  }
  return out
}

/* ------------------------------------------------------------------ */
/* Queries (published only, local API, depth tuned per surface)        */
/*                                                                     */
/* Localization has `fallback: true`, so a post written only in Spanish */
/* would otherwise show up in English with Spanish text and an empty    */
/* slug. Every public read below uses `fallbackLocale: false` and keeps */
/* only docs with real content in THAT locale (see lib/localized-content). */
/* ------------------------------------------------------------------ */
const PUBLISHED: Where = { _status: { equals: 'published' } }

/** True when the post has title + slug + body in the locale it was read with. */
export function postHasContent(post: Pick<Post, 'title' | 'slug' | 'content'> | null | undefined): boolean {
  return !!post && hasLocaleContent('posts', post)
}

/** True when the category has title + slug in the locale it was read with. */
export function categoryHasContent(cat: Pick<Category, 'title' | 'slug'> | null | undefined): boolean {
  return !!cat && hasLocaleContent('categories', cat)
}

const relId = (v: unknown): number | string | null =>
  v && typeof v === 'object' ? ((v as { id?: number | string }).id ?? null) : (v as number | string | null)

/** Published posts that really exist in `lang`, newest first. Single source for every listing. */
async function findLocalPosts(lang: AppLocale, and: Where[] = [], depth = 1): Promise<Post[]> {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'posts',
    locale: lang,
    fallbackLocale: false,
    where: { and: [PUBLISHED, { slug: { exists: true } }, ...and] },
    sort: '-publishedAt',
    depth,
    limit: 200,
    pagination: false,
    overrideAccess: false,
  })
  return docs.filter(postHasContent)
}

export async function getPublishedPosts(lang: AppLocale, limit = 50): Promise<Post[]> {
  return (await findLocalPosts(lang)).slice(0, limit)
}

export async function getPostBySlug(lang: AppLocale, slug: string): Promise<Post | null> {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'posts',
    locale: lang,
    fallbackLocale: false,
    where: {
      and: [PUBLISHED, { slug: { equals: slug } }],
    },
    depth: 2,
    limit: 1,
    overrideAccess: false,
  })
  const post = docs[0] ?? null
  return postHasContent(post) ? post : null
}

/** Categories with a title in `lang` AND at least one post in `lang` (no empty category pages). */
export async function getCategories(lang: AppLocale): Promise<Category[]> {
  const payload = await getPayloadClient()
  const [{ docs }, posts] = await Promise.all([
    payload.find({
      collection: 'categories',
      locale: lang,
      fallbackLocale: false,
      sort: 'title',
      depth: 0,
      limit: 50,
    }),
    findLocalPosts(lang, [], 0),
  ])
  const used = new Set(posts.map((p) => relId(p.category)).filter((id) => id != null))
  return docs.filter((c) => categoryHasContent(c) && used.has(c.id))
}

export async function getCategoryBySlug(lang: AppLocale, slug: string): Promise<Category | null> {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'categories',
    locale: lang,
    fallbackLocale: false,
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
  })
  const category = docs[0] ?? null
  if (!categoryHasContent(category)) return null
  // A category with no posts in this language is an empty page: 404 it.
  const posts = await findLocalPosts(lang, [{ category: { equals: category!.id } }], 0)
  return posts.length > 0 ? category : null
}

export async function getPostsByCategory(lang: AppLocale, categoryId: number): Promise<Post[]> {
  return (await findLocalPosts(lang, [{ category: { equals: categoryId } }])).slice(0, 50)
}

/**
 * Author page exists in `lang` if the author wrote a bio in `lang` or has at least one
 * post in `lang`. Decided with no fallback; the returned doc keeps the usual fallback
 * so the profile UI never renders empty role/bio strings.
 */
export async function getAuthorBySlug(lang: AppLocale, slug: string): Promise<Author | null> {
  const payload = await getPayloadClient()
  const where: Where = { slug: { equals: slug } }
  const [strict, shown] = await Promise.all([
    payload.find({ collection: 'authors', locale: lang, fallbackLocale: false, where, depth: 0, limit: 1 }),
    payload.find({ collection: 'authors', locale: lang, where, depth: 1, limit: 1 }),
  ])
  const author = shown.docs[0] ?? null
  if (!author) return null
  if (strict.docs[0] && hasLocaleContent('authors', strict.docs[0])) return author
  const posts = await findLocalPosts(lang, [{ author: { equals: author.id } }], 0)
  return posts.length > 0 ? author : null
}

export async function getPostsByAuthor(lang: AppLocale, authorId: number): Promise<Post[]> {
  return (await findLocalPosts(lang, [{ author: { equals: authorId } }])).slice(0, 50)
}

/** Per-category published counts for a locale (sidebar badges). */
export async function getCategoryCounts(
  lang: AppLocale,
  categories: Category[],
): Promise<Record<number, number>> {
  const posts = await findLocalPosts(lang, [], 0)
  const counts: Record<number, number> = {}
  for (const c of categories) counts[c.id] = 0
  for (const p of posts) {
    const id = relId(p.category)
    if (typeof id === 'number' && id in counts) counts[id] += 1
  }
  return counts
}

/**
 * Read EVERY locale's `slug` for a single document (for reciprocal hreflang).
 * `locale: 'all'` returns the raw per-locale values with no fallback; only locales
 * where the document has real content are surfaced, so an untranslated post never
 * advertises an alternate URL that would 404.
 */
export async function getLocalizedSlugMap(
  collection: 'posts' | 'pages' | 'categories',
  id: number | string,
): Promise<Record<string, string>> {
  const payload = await getPayloadClient()
  const doc = (await payload.findByID({
    collection,
    id,
    locale: 'all',
    depth: 0,
  })) as unknown as Record<string, unknown> | null
  const slug = doc?.slug
  const out: Record<string, string> = {}
  if (doc && slug && typeof slug === 'object') {
    for (const [loc, val] of Object.entries(slug as Record<string, unknown>)) {
      if (typeof val === 'string' && val && docHasLocaleContent(collection, doc, loc)) out[loc] = val
    }
  }
  return out
}
