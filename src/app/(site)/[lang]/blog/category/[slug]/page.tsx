import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { routing } from '@/i18n/routing'
import { SITE_URL, localizedAlternates, type AppLocale } from '@/lib/site'
import {
  asMedia,
  getCategories,
  getCategoryBySlug,
  getCategoryCounts,
  getLocalizedSlugMap,
  getPayloadClient,
  getPostsByCategory,
} from '@/lib/blog'
import { BlogCard } from '@/components/blog/BlogCard'
import { CroCard, NewsletterMini } from '@/components/blog/Sidebar'

export const revalidate = 3600
export const dynamicParams = true

export async function generateStaticParams() {
  const payload = await getPayloadClient()
  const params: { lang: string; slug: string }[] = []
  for (const lang of routing.locales) {
    const { docs } = await payload.find({
      collection: 'categories',
      locale: lang,
      depth: 0,
      select: { slug: true },
      limit: 200,
      pagination: false,
    })
    for (const d of docs) {
      if (d.slug) params.push({ lang, slug: d.slug })
    }
  }
  return params
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}): Promise<Metadata> {
  const { lang, slug } = await params
  const category = await getCategoryBySlug(lang as AppLocale, slug)
  if (!category) return {}

  const slugMap = await getLocalizedSlugMap('categories', category.id)
  const { canonical, languages } = localizedAlternates(
    lang as AppLocale,
    slugMap,
    (loc, s) => `${SITE_URL}/${loc}/blog/category/${s}`,
  )

  return {
    title: `${category.title} | Apturio`,
    description: category.description ?? `${category.title} — Apturio`,
    alternates: { canonical, languages },
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang: langStr, slug } = await params
  const lang = langStr as AppLocale
  setRequestLocale(lang)
  const t = await getTranslations({ locale: lang, namespace: 'blog' })

  const category = await getCategoryBySlug(lang, slug)
  if (!category) notFound()

  const [posts, categories] = await Promise.all([
    getPostsByCategory(lang, category.id),
    getCategories(lang),
  ])
  const counts = await getCategoryCounts(lang, categories)
  const lead = posts[0] ?? null
  const grid = lead ? posts.slice(1) : posts
  const leadHero = asMedia(lead?.heroImage)

  return (
    <main>
      {/* subnav */}
      <div className="subnav">
        <div className="wrap">
          <div className="subnav-in">
            <Link href={`/${lang}/blog`} className="cat-chip">
              {t('all')}
            </Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/${lang}/blog/category/${c.slug}`}
                className={`cat-chip${c.id === category.id ? ' on' : ''}`}
              >
                <span className="ck" />
                {c.title}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* head */}
      <header className="page-head">
        <div className="wrap inner">
          <div className="breadcrumb" style={{ justifyContent: 'flex-start', marginBottom: 0 }}>
            <Link href={`/${lang}/blog`}>{t('blog')}</Link>
            <span className="sep">/</span>
            <span style={{ color: '#E7E8EE' }}>{t('category')}</span>
          </div>
          <span className="eyebrow" style={{ marginTop: 14 }}>
            {t('category')} · {t('categoryCount', { count: posts.length })}
          </span>
          <h1>{category.title}</h1>
          {category.description && <p>{category.description}</p>}
        </div>
      </header>

      {/* lead article */}
      {lead && (
        <section className="wrap">
          <Link href={`/${lang}/blog/${lead.slug}`} className="cat-hero">
            <div className="media">
              {leadHero?.url ? (
                <img src={leadHero.url} alt={leadHero.alt ?? lead.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div className="img-slot" />
              )}
            </div>
            <div className="body">
              <span className="tag-chip">
                <span className="d" />
                {t('editorsPick')}
              </span>
              <h2>{lead.title}</h2>
              {lead.excerpt && <p className="excerpt">{lead.excerpt}</p>}
              <span className="arrow" style={{ marginTop: 22, color: 'var(--brand)', fontWeight: 700, display: 'inline-flex', gap: 8, alignItems: 'center' }}>
                {t('readArticle')} <ArrowRight />
              </span>
            </div>
          </Link>
        </section>
      )}

      {/* grid + sidebar */}
      <section className="wrap">
        <div className="cat-layout">
          <div>
            <div className="list-head" style={{ marginTop: 0 }}>
              <div>
                <h2>{t('allInCategory')}</h2>
              </div>
            </div>
            <div className="card-grid cols-2" id="cat-grid">
              {grid.map((post) => (
                <BlogCard key={post.id} post={post} locale={lang} />
              ))}
            </div>
          </div>

          <aside className="sidebar">
            <CroCard locale={lang} />
            <div className="side-block">
              <h4>{t('categoriesHeading')}</h4>
              <div className="side-cats">
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    href={`/${lang}/blog/category/${c.slug}`}
                    className={c.id === category.id ? 'on' : undefined}
                  >
                    {c.title} <span className="n">{counts[c.id] ?? 0}</span>
                  </Link>
                ))}
              </div>
            </div>
            <NewsletterMini locale={lang} />
          </aside>
        </div>
      </section>
    </main>
  )
}
