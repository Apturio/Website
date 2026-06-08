import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'

import { pageMetadata, type AppLocale } from '@/lib/site'
import { getPageBySlug } from '@/lib/pages'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

// ISR: pre-render known Pages at build, refresh at most hourly. Publishing in
// admin fires the afterChange revalidate hook for instant updates.
export const revalidate = 3600

export async function generateStaticParams() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'pages',
    where: { _status: { equals: 'published' } },
    limit: 1000,
    depth: 0,
    pagination: false,
    select: { slug: true, lang: true },
  })

  return docs
    // `home` is served by /[lang]/page.tsx — exclude it from the catch-all.
    .filter((p) => p.slug && p.slug !== 'home')
    .map((p) => ({ lang: p.lang as string, slug: (p.slug as string).split('/') }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string[] }>
}): Promise<Metadata> {
  const { lang, slug } = await params
  const page = await getPageBySlug(lang, slug.join('/'))
  if (!page) return {}

  return pageMetadata({
    locale: lang as AppLocale,
    path: `/${slug.join('/')}`,
    title: page.seo?.metaTitle || page.title,
    description: page.seo?.metaDescription || '',
  })
}

export default async function DynamicPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string[] }>
}) {
  const { lang, slug } = await params
  setRequestLocale(lang)

  const page = await getPageBySlug(lang, slug.join('/'))
  if (!page || !page.layout || page.layout.length === 0) notFound()

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
