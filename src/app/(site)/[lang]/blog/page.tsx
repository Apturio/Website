import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { routing } from '@/i18n/routing'
import { SITE_URL, pageMetadata, type AppLocale } from '@/lib/site'
import {
  asAuthor,
  asCategory,
  asMedia,
  formatDate,
  getCategories,
  getPublishedPosts,
  readTimeLabel,
} from '@/lib/blog'
import { BlogCard } from '@/components/blog/BlogCard'
import { CategoryFilter, type FilterChip } from '@/components/blog/CategoryFilter'
import { PageJsonLd } from '@/components/PageJsonLd'

export const revalidate = 3600

export function generateStaticParams() {
  return routing.locales.map((lang) => ({ lang }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const t = await getTranslations({ locale: lang, namespace: 'blog' })
  return pageMetadata({
    locale: lang as AppLocale,
    path: '/blog',
    title: `${t('eyebrow')} | Apturio`,
    description: t('indexSubtitle'),
  })
}

export default async function BlogIndexPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: langStr } = await params
  const lang = langStr as AppLocale
  setRequestLocale(lang)
  const t = await getTranslations({ locale: lang, namespace: 'blog' })

  const [posts, categories] = await Promise.all([getPublishedPosts(lang), getCategories(lang)])
  const featured = posts.find((p) => p.featured) ?? posts[0] ?? null
  const rest = posts.filter((p) => p.id !== featured?.id)

  const chips: FilterChip[] = [
    { value: 'all', label: t('all') },
    ...categories.map((c) => ({ value: c.slug, label: c.title })),
  ]

  const featAuthor = asAuthor(featured?.author ?? null)
  const featCategory = asCategory(featured?.category ?? null)
  const featHero = asMedia(featured?.heroImage)

  return (
    <main>
      {/* category subnav (client filter) */}
      <div className="subnav">
        <div className="wrap">
          <CategoryFilter chips={chips} targetId="latest" withDot />
        </div>
      </div>

      {/* page head */}
      <header className="page-head">
        <div className="wrap inner">
          <span className="eyebrow">{t('eyebrow')}</span>
          <h1>{t('indexTitle')}</h1>
          <p>{t('indexSubtitle')}</p>
        </div>
      </header>

      {/* featured */}
      {featured && (
        <section className="wrap">
          <Link href={`/${lang}/blog/${featured.slug}`} className="featured">
            <div className="media">
              <span className="tag tag-chip">
                <span className="d" />
                {t('featured')}
              </span>
              {featHero?.url ? (
                <img src={featHero.url} alt={featHero.alt ?? featured.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div className="img-slot" />
              )}
            </div>
            <div className="body">
              <div className="kicker">
                {featCategory && (
                  <span className="tag-chip">
                    <span className="d" />
                    {featCategory.title}
                  </span>
                )}
                <span style={{ fontSize: 13, color: 'var(--fg-faint)' }}>{readTimeLabel(featured, lang)}</span>
              </div>
              <h2>{featured.title}</h2>
              {featured.excerpt && <p className="excerpt">{featured.excerpt}</p>}
              <div className="meta">
                <span className="avatar">
                  {asMedia(featAuthor?.avatar)?.url ? (
                    <img src={asMedia(featAuthor?.avatar)!.url!} alt={featAuthor?.name ?? ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span className="img-slot circle" />
                  )}
                </span>
                {featAuthor && <span className="nm">{featAuthor.name}</span>}
                <span className="dot" />
                <span>{formatDate(featured.publishedAt, lang)}</span>
              </div>
              <span className="arrow">
                {t('readPlaybook')} <ArrowRight />
              </span>
            </div>
          </Link>
        </section>
      )}

      {/* latest grid */}
      <section className="wrap">
        <div className="list-head">
          <div>
            <h2>{t('latest')}</h2>
            <p className="sub">{t('latestSub')}</p>
          </div>
        </div>
        <div className="card-grid" id="latest">
          {rest.map((post) => (
            <BlogCard key={post.id} post={post} locale={lang} />
          ))}
          {rest.length === 0 && featured && <BlogCard post={featured} locale={lang} />}
        </div>
      </section>

      {/* CollectionPage + Home-first Breadcrumb [Home, Blog]. */}
      <PageJsonLd
        kind="blog-index"
        locale={lang}
        url={`${SITE_URL}/${lang}/blog`}
        title={t('indexTitle')}
        description={t('indexSubtitle')}
      />
    </main>
  )
}
