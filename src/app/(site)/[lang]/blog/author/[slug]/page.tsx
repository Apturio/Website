import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Bell, Globe } from 'lucide-react'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { routing } from '@/i18n/routing'
import { SITE_URL, pageMetadata, type AppLocale } from '@/lib/site'
import {
  asCategory,
  asMedia,
  getAuthorBySlug,
  getPayloadClient,
  getPostsByAuthor,
} from '@/lib/blog'
import { BlogCard } from '@/components/blog/BlogCard'
import { CroCard, NewsletterMini } from '@/components/blog/Sidebar'
import { PageJsonLd } from '@/components/PageJsonLd'
import type { AuthorInput } from '@/lib/schema/builders/profile'

export const revalidate = 3600
export const dynamicParams = true

export async function generateStaticParams() {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'authors',
    depth: 0,
    select: { slug: true },
    limit: 200,
    pagination: false,
  })
  return docs.flatMap((d) => routing.locales.map((lang) => ({ lang, slug: d.slug })))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}): Promise<Metadata> {
  const { lang, slug } = await params
  const author = await getAuthorBySlug(lang as AppLocale, slug)
  if (!author) return {}
  return pageMetadata({
    locale: lang as AppLocale,
    path: `/blog/author/${author.slug}`,
    title: `${author.name} | Apturio`,
    description: author.bio ?? `${author.name} — Apturio`,
  })
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang: langStr, slug } = await params
  const lang = langStr as AppLocale
  setRequestLocale(lang)
  const t = await getTranslations({ locale: lang, namespace: 'blog' })

  const author = await getAuthorBySlug(lang, slug)
  if (!author) notFound()

  const posts = await getPostsByAuthor(lang, author.id)
  const categoryCount = new Set(
    posts.map((p) => asCategory(p.category)?.id).filter((v): v is number => typeof v === 'number'),
  ).size
  const reads = author.stats?.reads
  const avatar = asMedia(author.avatar)
  const socials = author.socials

  // Map the `socials` GROUP { linkedin, x, website } to a filtered, non-empty
  // sameAs[] (T-15-15). These are free-form CMS text fields, so each value IS
  // domain-validated before it becomes an authoritative `sameAs` association:
  // `linkedin` must be a linkedin.com URL, `x` an x.com/twitter.com URL; `website`
  // is legitimately arbitrary but must still be a valid http(s) URL. Values that
  // fail validation are dropped (prevents an editor pointing sameAs at a
  // competitor/phishing URL — CMS-sourced sameAs without domain validation).
  const isHttpUrl = (v: string): boolean => {
    try {
      return /^https?:$/.test(new URL(v).protocol)
    } catch {
      return false
    }
  }
  const sameAs = [
    socials?.linkedin && /^https:\/\/(www\.)?linkedin\.com\//.test(socials.linkedin)
      ? socials.linkedin
      : null,
    socials?.x && /^https:\/\/(www\.)?(x|twitter)\.com\//.test(socials.x) ? socials.x : null,
    socials?.website && isHttpUrl(socials.website) ? socials.website : null,
  ].filter((v): v is string => typeof v === 'string' && v.length > 0)
  const authorInput: AuthorInput = {
    name: author.name,
    slug: author.slug,
    bio: author.bio ?? undefined,
    avatarUrl: avatar?.url ?? undefined,
    role: author.role ?? undefined,
    ...(sameAs.length > 0 ? { sameAs } : {}),
  }

  const readsLabel =
    typeof reads === 'number' ? (reads >= 1000 ? `${Math.round(reads / 100) / 10}k` : `${reads}`) : '—'

  return (
    <main>
      {/* hero */}
      <header className="author-hero">
        <div className="wrap inner">
          <div className="breadcrumb" style={{ justifyContent: 'flex-start', marginBottom: 28 }}>
            <Link href={`/${lang}/blog`}>{t('blog')}</Link>
            <span className="sep">/</span>
            <span style={{ color: '#A6A7AE' }}>{t('authors')}</span>
            <span className="sep">/</span>
            <span style={{ color: '#E7E8EE' }}>{author.name}</span>
          </div>

          <div className="author-top">
            <div className="author-avatar">
              {avatar?.url ? (
                <img src={avatar.url} alt={author.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%', border: '3px solid #000' }} />
              ) : (
                <span className="img-slot circle" />
              )}
            </div>
            <div className="author-id">
              {author.role && <span className="eyebrow">{author.role}</span>}
              <h1>{author.name}</h1>
              {author.role && <p className="role">{author.role} · Apturio</p>}
              {author.bio && <p className="bio">{author.bio}</p>}
              <div className="author-actions">
                <div className="author-social">
                  {socials?.linkedin && (
                    <a href={socials.linkedin} aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M4.98 3.5C4.98 4.88 3.87 6 2.49 6S0 4.88 0 3.5 1.11 1 2.49 1 4.98 2.12 4.98 3.5zM.22 8.02H4.76V23H.22V8.02zM8.34 8.02h4.35v2.05h.06c.61-1.15 2.1-2.36 4.32-2.36 4.62 0 5.47 3.04 5.47 6.99V23h-4.54v-6.39c0-1.52-.03-3.48-2.12-3.48-2.12 0-2.45 1.66-2.45 3.37V23H8.34V8.02z" />
                      </svg>
                    </a>
                  )}
                  {socials?.x && (
                    <a href={socials.x} aria-label="X" target="_blank" rel="noopener noreferrer">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
                      </svg>
                    </a>
                  )}
                  {socials?.website && (
                    <a href={socials.website} aria-label="Website" target="_blank" rel="noopener noreferrer">
                      <Globe />
                    </a>
                  )}
                </div>
                <button type="button" className="btn btn-dark btn-pill">
                  <Bell />
                  {t('follow')}
                </button>
              </div>
            </div>

            <div className="author-stats">
              <div className="stat">
                <div className="n">{posts.length}</div>
                <div className="l">{t('statArticles')}</div>
              </div>
              <div className="stat">
                <div className="n">{categoryCount}</div>
                <div className="l">{t('statCategories')}</div>
              </div>
              <div className="stat">
                <div className="n">{readsLabel}</div>
                <div className="l">{t('statReads')}</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* body */}
      <section className="wrap">
        <div className="author-layout">
          <div>
            <div className="list-head" style={{ marginTop: 0 }}>
              <div>
                <h2>{t('articlesBy', { name: author.name })}</h2>
                <p className="sub">{t('latestSub')}</p>
              </div>
            </div>
            <div className="card-grid cols-2" id="author-grid">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} locale={lang} />
              ))}
            </div>
          </div>

          <aside className="sidebar">
            <CroCard locale={lang} />
            {Array.isArray(author.expertise) && author.expertise.length > 0 && (
              <div className="side-block">
                <h4>{t('writesAbout')}</h4>
                <div className="topic-tags">
                  {author.expertise.map((e, i) => (
                    <span key={e.id ?? i} className="topic">
                      {e.topic}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <NewsletterMini locale={lang} />
          </aside>
        </div>
      </section>

      {/* ProfilePage + Person (sameAs from socials group) + [Home, Blog, Author]. */}
      <PageJsonLd
        kind="author"
        locale={lang}
        url={`${SITE_URL}/${lang}/blog/author/${author.slug}`}
        author={authorInput}
      />
    </main>
  )
}
