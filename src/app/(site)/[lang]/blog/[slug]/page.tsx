import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, Link2 } from 'lucide-react'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { routing } from '@/i18n/routing'
import { SITE_URL, SITE_NAME, localizedAlternates, type AppLocale } from '@/lib/site'
import {
  asAuthor,
  asCategory,
  asMedia,
  extractHeadings,
  formatDate,
  getLocalizedSlugMap,
  getPayloadClient,
  getPostBySlug,
  getPublishedPosts,
  readTimeLabel,
} from '@/lib/blog'
import type { Post } from '@/payload-types'
import { ArticleBody } from '@/components/blog/ArticleBody'
import { ReadingProgress } from '@/components/blog/ReadingProgress'
import { TOC } from '@/components/blog/TOC'
import { CroCard } from '@/components/blog/Sidebar'
import { BlogCard } from '@/components/blog/BlogCard'
import { BlogPostJsonLd } from '@/components/blog/BlogJsonLd'

export const revalidate = 3600
export const dynamicParams = true

export async function generateStaticParams() {
  const payload = await getPayloadClient()
  const params: { lang: string; slug: string }[] = []
  for (const lang of routing.locales) {
    const { docs } = await payload.find({
      collection: 'posts',
      locale: lang,
      where: { _status: { equals: 'published' } },
      depth: 0,
      select: { slug: true },
      limit: 200,
      pagination: false,
      overrideAccess: false,
    })
    for (const d of docs) {
      if (d.slug) params.push({ lang, slug: d.slug })
    }
  }
  return params
}

/** Reciprocal hreflang: one document holds a slug per locale. Emit an alternate
 * for every locale that has a stored slug. Always self + x-default (→ EN). */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}): Promise<Metadata> {
  const { lang: langStr, slug } = await params
  const lang = langStr as AppLocale
  const post = await getPostBySlug(lang, slug)
  if (!post) return {}

  const slugMap = await getLocalizedSlugMap('posts', post.id)
  const { canonical: selfUrl, languages } = localizedAlternates(
    lang,
    slugMap,
    (loc, s) => `${SITE_URL}/${loc}/blog/${s}`,
  )

  const title = post.meta?.title ?? `${post.title} | ${SITE_NAME}`
  const description = post.meta?.description ?? post.excerpt ?? undefined
  const ogImage = asMedia(post.meta?.image) ?? asMedia(post.heroImage)

  return {
    title,
    description,
    alternates: { canonical: selfUrl, languages },
    openGraph: {
      title,
      description,
      url: selfUrl,
      siteName: SITE_NAME,
      type: 'article',
      locale: lang === 'es' ? 'es_ES' : 'en_US',
      ...(ogImage?.url ? { images: [{ url: ogImage.url }] } : {}),
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang: langStr, slug } = await params
  const lang = langStr as AppLocale
  setRequestLocale(lang)
  const t = await getTranslations({ locale: lang, namespace: 'blog' })

  const post = await getPostBySlug(lang, slug)
  if (!post) notFound()

  const author = asAuthor(post.author)
  const category = asCategory(post.category)
  const hero = asMedia(post.heroImage)
  const headings = extractHeadings(post.content)

  // Related: manual relatedPosts (depth-resolved) else recent same-locale posts.
  let related: Post[] = Array.isArray(post.relatedPosts)
    ? post.relatedPosts.filter((p): p is Post => typeof p === 'object')
    : []
  if (related.length === 0) {
    const recent = await getPublishedPosts(lang, 4)
    related = recent.filter((p) => p.id !== post.id).slice(0, 3)
  } else {
    related = related.slice(0, 3)
  }

  const shareUrl = `${SITE_URL}/${lang}/blog/${post.slug}`
  const xShare = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`
  const liShare = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`

  return (
    <main>
      <ReadingProgress />

      {/* post head (dark) */}
      <header className="post-head">
        <div className="wrap inner">
          <div className="breadcrumb">
            <Link href={`/${lang}/blog`}>{t('blog')}</Link>
            <span className="sep">/</span>
            {category && (
              <>
                <Link href={`/${lang}/blog/category/${category.slug}`}>{category.title}</Link>
                <span className="sep">/</span>
              </>
            )}
            <span style={{ color: '#A6A7AE' }}>{t('article')}</span>
          </div>
          {category && (
            <span className="tag-chip">
              <span className="d" />
              {category.title}
            </span>
          )}
          <h1>{post.title}</h1>
          {post.excerpt && <p className="dek">{post.excerpt}</p>}
          <div className="post-meta">
            <span className="avatar">
              {asMedia(author?.avatar)?.url ? (
                <img src={asMedia(author?.avatar)!.url!} alt={author?.name ?? ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span className="img-slot circle" />
              )}
            </span>
            {author && <span className="nm">{author.name}</span>}
            {author?.role && (
              <>
                <span className="dot" />
                <span>{author.role}</span>
              </>
            )}
            <span className="dot" />
            <span>{formatDate(post.publishedAt, lang)}</span>
            <span className="dot" />
            <span>{readTimeLabel(post, lang)}</span>
          </div>
        </div>
      </header>

      {/* white paper reading sheet */}
      <div className="post-paper">
        <div className="wrap">
          <div className="post-hero">
            {hero?.url ? (
              <img src={hero.url} alt={hero.alt ?? post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 32 }} />
            ) : (
              <div className="img-slot" />
            )}
          </div>
        </div>

        <div className="wrap">
          <div className="post-layout">
            <div>
              <ArticleBody content={post.content} />

              {/* share */}
              <div className="share">
                <span className="lbl">{t('share')}</span>
                <a href={xShare} aria-label="X" target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
                  </svg>
                </a>
                <a href={liShare} aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4.98 3.5C4.98 4.88 3.87 6 2.49 6S0 4.88 0 3.5 1.11 1 2.49 1 4.98 2.12 4.98 3.5zM.22 8.02H4.76V23H.22V8.02zM8.34 8.02h4.35v2.05h.06c.61-1.15 2.1-2.36 4.32-2.36 4.62 0 5.47 3.04 5.47 6.99V23h-4.54v-6.39c0-1.52-.03-3.48-2.12-3.48-2.12 0-2.45 1.66-2.45 3.37V23H8.34V8.02z" />
                  </svg>
                </a>
                <a href={shareUrl} aria-label="Copy link">
                  <Link2 />
                </a>
              </div>

              {/* author box */}
              {author && (
                <div className="author-box">
                  <span className="avatar">
                    {asMedia(author.avatar)?.url ? (
                      <img src={asMedia(author.avatar)!.url!} alt={author.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span className="img-slot circle" />
                    )}
                  </span>
                  <div>
                    <Link href={`/${lang}/blog/author/${author.slug}`} className="nm" style={{ display: 'block' }}>
                      {author.name}
                    </Link>
                    {author.role && <div className="role">{author.role} · Apturio</div>}
                    {author.bio && <p className="bio">{author.bio}</p>}
                  </div>
                </div>
              )}
            </div>

            {/* sticky sidebar: TOC + CRO */}
            <aside className="post-sidebar">
              <TOC headings={headings} title={t('onThisPage')} />
              <CroCard locale={lang} />
            </aside>
          </div>
        </div>
      </div>

      {/* related */}
      {related.length > 0 && (
        <section className="related">
          <div className="wrap">
            <div className="list-head" style={{ marginTop: 0 }}>
              <div>
                <h2>{t('keepReading')}</h2>
              </div>
              <Link href={`/${lang}/blog`} className="more">
                {t('allArticles')} <ArrowRight />
              </Link>
            </div>
            <div className="card-grid">
              {related.map((p) => (
                <BlogCard key={p.id} post={p} locale={lang} />
              ))}
            </div>
          </div>
        </section>
      )}

      <BlogPostJsonLd post={post} locale={lang} />
    </main>
  )
}
