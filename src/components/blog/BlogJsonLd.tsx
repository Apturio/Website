import type { Thing, WithContext } from 'schema-dts'

import type { Post } from '@/payload-types'
import type { AppLocale } from '@/lib/site'
import { SITE_URL, SITE_NAME } from '@/lib/site'
import { asAuthor, asCategory, asMedia } from '@/lib/blog'
import { JsonLdScript } from '@/components/JsonLdScript'

// BlogPosting/BreadcrumbList are assembled as plain objects from CMS-sourced
// fields; cast to the shared component's schema-dts prop so every JSON-LD
// script routes through safeSerialize (XSS control point, T-14-06).
function Script({ data }: { data: Record<string, unknown> }) {
  return <JsonLdScript data={data as unknown as WithContext<Thing>} />
}

/**
 * Emits BlogPosting + BreadcrumbList JSON-LD for a single post (SCHEMA-04).
 * Server Component (no client state).
 */
export function BlogPostJsonLd({ post, locale }: { post: Post; locale: AppLocale }) {
  const url = `${SITE_URL}/${locale}/blog/${post.slug}`
  const author = asAuthor(post.author)
  const category = asCategory(post.category)
  const hero = asMedia(post.heroImage)
  const ogImage = asMedia(post.meta?.image) ?? hero

  const blogPosting: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt ?? post.meta?.description ?? undefined,
    inLanguage: locale,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url,
    datePublished: post.publishedAt ?? post.createdAt,
    dateModified: post.updatedAt,
    author: author
      ? { '@type': 'Person', name: author.name, url: `${SITE_URL}/${locale}/blog/author/${author.slug}` }
      : { '@type': 'Organization', name: SITE_NAME },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    ...(ogImage?.url ? { image: ogImage.url } : {}),
    ...(category ? { articleSection: category.title } : {}),
  }

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Blog', item: `${SITE_URL}/${locale}/blog` },
      ...(category
        ? [
            {
              '@type': 'ListItem',
              position: 2,
              name: category.title,
              item: `${SITE_URL}/${locale}/blog/category/${category.slug}`,
            },
          ]
        : []),
      {
        '@type': 'ListItem',
        position: category ? 3 : 2,
        name: post.title,
        item: url,
      },
    ],
  }

  return (
    <>
      <Script data={blogPosting} />
      <Script data={breadcrumb} />
    </>
  )
}
