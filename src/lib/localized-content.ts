// "Does this document really exist in this locale?" — single source of truth for
// hiding untranslated posts/pages (listings, detail pages, hreflang, sitemap).
//
// Payload has `localization.fallback: true`, so reading a post in a locale where it was
// never written returns the OTHER locale's text (and a null slug). Every public read
// therefore passes `fallbackLocale: false` and filters with these helpers, so a post
// written only in Spanish is invisible in English (and vice versa) until someone
// actually writes it. No import: this file is run directly by the tests.

export type ContentKind = 'posts' | 'pages' | 'categories' | 'authors'

const hasText = (v: unknown): boolean => typeof v === 'string' && v.trim().length > 0

/** Plain text of a Lexical editor state (or any node with `text` / `children`). */
export function lexicalPlainText(node: unknown): string {
  if (!node || typeof node !== 'object') return ''
  const n = node as { text?: unknown; root?: unknown; children?: unknown }
  if (typeof n.text === 'string') return n.text
  if (n.root) return lexicalPlainText(n.root)
  if (Array.isArray(n.children)) return n.children.map(lexicalPlainText).join(' ')
  return ''
}

export interface LocaleFields {
  title?: unknown
  slug?: unknown
  content?: unknown
  layout?: unknown
  bio?: unknown
}

/**
 * Fields of ONE locale (a doc read with `locale: <code>` and `fallbackLocale: false`).
 * - posts: title + slug + non-empty body
 * - pages: title + slug + at least one block
 * - categories: title + slug
 * - authors: a `bio` in this locale (the slug is shared, so it cannot decide). An author
 *   without a bio is still shown in a locale where they have at least one post: callers
 *   combine both signals.
 */
export function hasLocaleContent(kind: ContentKind, f: LocaleFields): boolean {
  switch (kind) {
    case 'posts':
      return hasText(f.title) && hasText(f.slug) && lexicalPlainText(f.content).trim().length > 0
    case 'pages':
      return hasText(f.title) && hasText(f.slug) && Array.isArray(f.layout) && f.layout.length > 0
    case 'categories':
      return hasText(f.title) && hasText(f.slug)
    case 'authors':
      return hasText(f.bio)
  }
}

const isKeyed = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v) && ('en' in v || 'es' in v)

/** Value of a localized field for `locale` from a doc read with `locale: 'all'`. */
export function localeValue(v: unknown, locale: string): unknown {
  return isKeyed(v) ? v[locale] : undefined
}

/** {@link hasLocaleContent} for a doc read with `locale: 'all'` (fields keyed by locale). */
export function docHasLocaleContent(
  kind: ContentKind,
  doc: Record<string, unknown>,
  locale: string,
): boolean {
  return hasLocaleContent(kind, {
    title: localeValue(doc.title, locale),
    slug: localeValue(doc.slug, locale),
    content: localeValue(doc.content, locale),
    layout: localeValue(doc.layout, locale),
    bio: localeValue(doc.bio, locale),
  })
}
