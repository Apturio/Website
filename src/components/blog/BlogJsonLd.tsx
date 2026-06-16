import type { Post } from '@/payload-types'
import type { AppLocale } from '@/lib/site'
import { SITE_URL } from '@/lib/site'
import { asAuthor, asCategory, asMedia } from '@/lib/blog'
import { countWordsInLexical } from '@/lib/hooks'
import { buildBlogPosting } from '@/lib/schema/builders/article'
import { applyJsonLdOverride } from '@/lib/schema/merge'
import {
  buildBreadcrumbList,
  HOME_LABEL,
  type BreadcrumbItem,
} from '@/lib/schema/builders/breadcrumb'
import { JsonLdScript } from '@/components/JsonLdScript'

/**
 * Emits BlogPosting + BreadcrumbList JSON-LD for a single post (SCHEMA-04 / SCHEMA-10).
 * Server Component (no client state). All serialization routes through `JsonLdScript`
 * (safeSerialize — the single XSS control point, T-15-05); this file performs no raw
 * serialization itself. The breadcrumb is Home-first via `buildBreadcrumbList` and the
 * post node references the global Organization/Person nodes by `@id`.
 */
export function BlogPostJsonLd({ post, locale }: { post: Post; locale: AppLocale }) {
  const url = `${SITE_URL}/${locale}/blog/${post.slug}`
  const author = asAuthor(post.author)
  const category = asCategory(post.category)
  const hero = asMedia(post.heroImage)
  const ogImage = asMedia(post.meta?.image) ?? hero

  // wordCount: plain-text word count of the post body, using the SAME lexical walk
  // the `computeReadTime` hook uses (Posts has no stored wordCount field).
  const wordCount = post.content ? countWordsInLexical(post.content) : 0

  // keywords: visible topical signals — category title + the author's expertise topics.
  const keywords = [
    category?.title,
    ...(author?.expertise ?? []).map((e) => e.topic),
  ].filter((k): k is string => Boolean(k))

  const blogPosting = buildBlogPosting({
    locale,
    url,
    title: post.title,
    excerpt: post.excerpt ?? post.meta?.description ?? undefined,
    datePublished: post.publishedAt ?? post.createdAt,
    dateModified: post.updatedAt,
    heroImageUrl: ogImage?.url ?? undefined,
    author: author ? { name: author.name, slug: author.slug } : undefined,
    category: category ? { title: category.title, slug: category.slug } : undefined,
    keywords,
    wordCount: wordCount > 0 ? wordCount : undefined,
  })

  // Apply the editor override to the BlogPosting PRIMARY node (override wins, arrays
  // replaced). Serialization still routes only through JsonLdScript/safeSerialize.
  const merged = applyJsonLdOverride(blogPosting, post.jsonLdOverride)

  // Home-first breadcrumb: Home → Blog → Category? → Post (caller builds the full list).
  const items: BreadcrumbItem[] = [
    { name: HOME_LABEL[locale], url: `${SITE_URL}/${locale}` },
    { name: 'Blog', url: `${SITE_URL}/${locale}/blog` },
    ...(category
      ? [{ name: category.title, url: `${SITE_URL}/${locale}/blog/category/${category.slug}` }]
      : []),
    { name: post.title, url },
  ]
  const breadcrumb = buildBreadcrumbList(items, locale)

  return (
    <>
      <JsonLdScript data={merged} />
      <JsonLdScript data={breadcrumb} />
    </>
  )
}
