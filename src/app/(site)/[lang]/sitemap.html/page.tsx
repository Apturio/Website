import type { Metadata } from 'next'
import Link from 'next/link'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { routing } from '@/i18n/routing'
import { pageMetadata, type AppLocale, localePrefix } from '@/lib/site'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { ComingSoonBadge } from '@/components/ComingSoonBadge'
import { getNavigationView, isExternalHref, type NavItemView } from '@/lib/navigation'
import { getPayloadClient, getPublishedPosts } from '@/lib/blog'
import { hasLocaleContent } from '@/lib/localized-content'
import { HOME_MARKER_SLUGS } from '@/lib/hooks'

interface ListedLink {
  href: string
  title: string
}

/**
 * Every published CMS page and post that really exists in `lang`. The footer only carries the
 * pages someone added to the navigation global, which left some pages with no internal link at
 * all (Google finds them only through the XML sitemap and treats them as low priority).
 */
async function getAllContentLinks(lang: AppLocale, home: string) {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'pages',
    locale: lang,
    fallbackLocale: false,
    where: { and: [{ _status: { equals: 'published' } }, { slug: { exists: true } }] },
    depth: 0,
    limit: 200,
    pagination: false,
    overrideAccess: false,
  })
  const pages: ListedLink[] = []
  for (const doc of docs as unknown as Array<{ title?: string | null; slug?: string | null; layout?: unknown }>) {
    if (!doc.slug || !doc.title || HOME_MARKER_SLUGS.has(doc.slug)) continue
    if (!hasLocaleContent('pages', { title: doc.title, slug: doc.slug, layout: doc.layout })) continue
    pages.push({ href: `${home}/${doc.slug}`, title: doc.title })
  }
  const posts: ListedLink[] = (await getPublishedPosts(lang, 200)).map((post) => ({
    href: `${home}/blog/${post.slug}`,
    title: post.title ?? post.slug ?? '',
  }))
  return { pages, posts }
}

export function generateStaticParams() {
  return routing.locales.map((lang) => ({ lang }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const t = await getTranslations({ locale: lang, namespace: 'sitemap' })
  return pageMetadata({
    locale: lang as AppLocale,
    path: '/sitemap.html',
    title: t('title'),
    description: t('description'),
  })
}

// Module-local duplicate of Footer.tsx's FooterLinkRow (same live/comingSoon
// treatment, same shared isExternalHref/NavItemView) — kept as a verbatim
// copy rather than an export from Footer.tsx to leave that Phase 22/23
// -verified file byte-unchanged (UI-SPEC.md sanctions this duplication since
// the JSX is short and stable).
function SitemapLinkRow({
  item,
  home,
  comingSoonLabel,
}: {
  item: NavItemView
  home: string
  comingSoonLabel: string
}) {
  if (item.status === 'live' && item.href) {
    const external = isExternalHref(item.href)
    const resolvedHref = external ? item.href : `${home}${item.href}`
    return (
      <li>
        {external ? (
          <a
            href={resolvedHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-slate-400 hover:text-primary transition-colors"
          >
            {item.label}
          </a>
        ) : (
          <Link href={resolvedHref} className="text-sm text-slate-400 hover:text-primary transition-colors">
            {item.label}
          </Link>
        )}
      </li>
    )
  }

  return (
    <li aria-disabled="true" className="flex items-center gap-2 cursor-default">
      <span className="text-sm text-slate-400">{item.label}</span>
      <ComingSoonBadge label={comingSoonLabel} />
    </li>
  )
}

export default async function SitemapPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  setRequestLocale(lang)
  const t = await getTranslations({ locale: lang })
  const view = await getNavigationView(lang, t)
  const home = localePrefix(lang)
  const comingSoonLabel = t('nav.comingSoon')
  let content: { pages: ListedLink[]; posts: ListedLink[] } = { pages: [], posts: [] }
  try {
    content = await getAllContentLinks(lang as AppLocale, home)
  } catch (err) {
    // The navigation columns above still render if the CMS query fails.
    console.error('[sitemap.html] content links failed', err)
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-32">
        <h1 className="text-4xl font-semibold font-heading text-white">{t('sitemap.title')}</h1>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-12">
          {view.footerColumns.map((column) => (
            <section key={column.id ?? column.heading}>
              <h2 className="text-2xl font-heading font-semibold text-primary">{column.heading}</h2>
              <ul className="mt-4 space-y-2">
                {column.items.map((item) => (
                  <SitemapLinkRow
                    key={item.id ?? item.label}
                    item={item}
                    home={home}
                    comingSoonLabel={comingSoonLabel}
                  />
                ))}
              </ul>

              {column.subgroup && (
                <>
                  <p className="mt-6 text-xs uppercase tracking-wide font-semibold text-muted-foreground">
                    {column.subgroup.heading}
                  </p>
                  <ul className="mt-4 space-y-2">
                    {column.subgroup.items.map((item) => (
                      <SitemapLinkRow
                        key={item.id ?? item.label}
                        item={item}
                        home={home}
                        comingSoonLabel={comingSoonLabel}
                      />
                    ))}
                  </ul>
                </>
              )}
            </section>
          ))}
        </div>

        {[
          { heading: t('sitemap.pagesHeading'), links: content.pages },
          { heading: t('sitemap.postsHeading'), links: content.posts },
        ]
          .filter((group) => group.links.length > 0)
          .map((group) => (
            <section key={group.heading} className="mt-16">
              <h2 className="text-2xl font-heading font-semibold text-primary">{group.heading}</h2>
              <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-slate-400 hover:text-primary transition-colors">
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
      </main>
      <Footer />
    </div>
  )
}
