import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound, permanentRedirect, redirect } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'

import { routing } from '@/i18n/routing'
import { SITE_URL, localizedAlternates, type AppLocale } from '@/lib/site'
import { getPageBySlug } from '@/lib/pages'
import { findRedirect } from '@/lib/redirects'
import { getLocalizedSlugMap } from '@/lib/blog'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

// ISR: pre-render known Pages at build, refresh at most hourly. Publishing in
// admin fires the afterChange revalidate hook for instant updates.
export const revalidate = 3600

export async function generateStaticParams() {
  const payload = await getPayload({ config })
  const params: { lang: string; slug: string[] }[] = []
  for (const lang of routing.locales) {
    const { docs } = await payload.find({
      collection: 'pages',
      locale: lang,
      where: { _status: { equals: 'published' } },
      limit: 1000,
      depth: 0,
      pagination: false,
      select: { slug: true },
    })
    for (const p of docs) {
      // `home` is served by /[lang]/page.tsx — exclude it from the catch-all.
      if (p.slug && p.slug !== 'home') {
        params.push({ lang, slug: (p.slug as string).split('/') })
      }
    }
  }
  return params
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string[] }>
}): Promise<Metadata> {
  const { lang, slug } = await params
  const page = await getPageBySlug(lang, slug.join('/'))
  if (!page) return {}

  const slugMap = await getLocalizedSlugMap('pages', page.id)
  const { canonical, languages } = localizedAlternates(
    lang as AppLocale,
    slugMap,
    (loc, s) => `${SITE_URL}/${loc}/${s}`,
  )

  return {
    title: page.meta?.title || page.title,
    description: page.meta?.description || '',
    alternates: { canonical, languages },
  }
}

export default async function DynamicPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string; slug: string[] }>
  searchParams: Promise<{ draft?: string }>
}) {
  const { lang, slug } = await params
  const { draft } = await searchParams
  const isDraft = draft === 'true'
  setRequestLocale(lang)

  const page = await getPageBySlug(lang, slug.join('/'), { draft: isDraft })

  // No matching Page → honor a CMS-managed redirect before 404ing.
  if (!page || !page.layout || page.layout.length === 0) {
    const requestPath = `/${lang}/${slug.join('/')}`
    const hit = await findRedirect(requestPath)
    if (hit) {
      // Permanent (301-class → Next emits 308) vs temporary (302-class → 307).
      if (hit.type === '301' || hit.type === '308') permanentRedirect(hit.to)
      redirect(hit.to)
    }
    notFound()
  }

  // Drop the footer advantage card if the page already ends with a CtaBlock,
  // to avoid rendering the advantage band twice.
  const hasCta = page.layout.some((b) => b.blockType === 'cta')

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/30">
      <Navbar />
      <main className="flex-1">
        <RenderBlocks layout={page.layout} lang={lang} />
      </main>
      <Footer showAdvantage={!hasCta} />
    </div>
  )
}
