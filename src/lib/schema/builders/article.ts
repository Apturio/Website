import type { AppLocale } from '@/lib/site'
import type { BlogPosting, WithContext } from 'schema-dts'
import { SITE_URL } from '@/lib/site'
import { IDS } from '@/lib/schema/ids'

/**
 * Pure-data input for {@link buildBlogPosting}. The caller (an RSC) resolves all
 * Payload relationships to primitives first — this builder never touches Payload,
 * JSX, or side effects (ARCHITECTURE Pattern 2). `wordCount`/`keywords` are
 * DERIVED at the call site (Posts has no such field) and passed in when present.
 */
export interface BlogPostingInput {
  locale: AppLocale
  url: string
  title: string
  excerpt?: string
  datePublished: string
  dateModified: string
  heroImageUrl?: string
  author?: { name: string; slug: string }
  category?: { title: string; slug: string }
  keywords?: string[]
  wordCount?: number
}

/**
 * Build a single post's `BlogPosting` node (SCHEMA-10). Cross-references the global
 * Organization/Person nodes by `@id` — NEVER inlines an Organization or Person
 * object (Pitfall 5, threat T-15-06). The global Organization node carries the
 * logo, so no inline logo is required here.
 *
 * `author` points at the per-author `ProfilePage` Person (`IDS.person(authorUrl)`)
 * when an author is present, else falls back to the Organization `@id`.
 * `inLanguage` is always the locale param (Pitfall 7 — never a literal). `image`,
 * `wordCount`, and `keywords` are emitted only when present (Pitfall 10 — no empty
 * or fabricated values).
 */
export function buildBlogPosting(input: BlogPostingInput): WithContext<BlogPosting> {
  const authorUrl = input.author
    ? `${SITE_URL}/${input.locale}/blog/author/${input.author.slug}`
    : null

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: input.title,
    ...(input.excerpt ? { description: input.excerpt } : {}),
    inLanguage: input.locale,
    mainEntityOfPage: { '@type': 'WebPage', '@id': input.url },
    url: input.url,
    datePublished: input.datePublished,
    dateModified: input.dateModified,
    author: authorUrl ? { '@id': IDS.person(authorUrl) } : { '@id': IDS.organization },
    publisher: { '@id': IDS.organization },
    ...(input.heroImageUrl ? { image: input.heroImageUrl } : {}),
    ...(input.category ? { articleSection: input.category.title } : {}),
    ...(input.wordCount !== undefined ? { wordCount: input.wordCount } : {}),
    ...(input.keywords && input.keywords.length > 0 ? { keywords: input.keywords } : {}),
  }
}
