import 'server-only'
import { getPayload } from 'payload'
import config from '@payload-config'

import { slugify } from '@/lib/slugify'
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
/* ------------------------------------------------------------------ */
export async function getPublishedPosts(lang: AppLocale, limit = 50): Promise<Post[]> {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'posts',
    locale: lang,
    where: { _status: { equals: 'published' } },
    sort: '-publishedAt',
    depth: 1,
    limit,
    overrideAccess: false,
  })
  return docs
}

export async function getPostBySlug(lang: AppLocale, slug: string): Promise<Post | null> {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'posts',
    locale: lang,
    where: {
      and: [{ _status: { equals: 'published' } }, { slug: { equals: slug } }],
    },
    depth: 2,
    limit: 1,
    overrideAccess: false,
  })
  return docs[0] ?? null
}

export async function getCategories(lang: AppLocale): Promise<Category[]> {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'categories',
    locale: lang,
    sort: 'title',
    depth: 0,
    limit: 50,
  })
  return docs
}

export async function getCategoryBySlug(lang: AppLocale, slug: string): Promise<Category | null> {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'categories',
    locale: lang,
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
  })
  return docs[0] ?? null
}

export async function getPostsByCategory(lang: AppLocale, categoryId: number): Promise<Post[]> {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'posts',
    locale: lang,
    where: {
      and: [{ _status: { equals: 'published' } }, { category: { equals: categoryId } }],
    },
    sort: '-publishedAt',
    depth: 1,
    limit: 50,
    overrideAccess: false,
  })
  return docs
}

export async function getAuthorBySlug(lang: AppLocale, slug: string): Promise<Author | null> {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'authors',
    locale: lang,
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
  })
  return docs[0] ?? null
}

export async function getPostsByAuthor(lang: AppLocale, authorId: number): Promise<Post[]> {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'posts',
    locale: lang,
    where: {
      and: [{ _status: { equals: 'published' } }, { author: { equals: authorId } }],
    },
    sort: '-publishedAt',
    depth: 1,
    limit: 50,
    overrideAccess: false,
  })
  return docs
}

/** Per-category published counts for a locale (sidebar badges). */
export async function getCategoryCounts(
  lang: AppLocale,
  categories: Category[],
): Promise<Record<number, number>> {
  const payload = await getPayloadClient()
  const entries = await Promise.all(
    categories.map(async (c) => {
      const { totalDocs } = await payload.find({
        collection: 'posts',
        locale: lang,
        where: {
          and: [{ _status: { equals: 'published' } }, { category: { equals: c.id } }],
        },
        depth: 0,
        limit: 1,
        overrideAccess: false,
      })
      return [c.id, totalDocs] as const
    }),
  )
  return Object.fromEntries(entries)
}

/**
 * Read EVERY locale's `slug` for a single document (for reciprocal hreflang).
 * `locale: 'all'` returns the raw per-locale slug map with no fallback, so we
 * only surface locales that actually have a stored slug.
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
  if (slug && typeof slug === 'object') {
    for (const [loc, val] of Object.entries(slug as Record<string, unknown>)) {
      if (typeof val === 'string' && val) out[loc] = val
    }
  }
  return out
}
