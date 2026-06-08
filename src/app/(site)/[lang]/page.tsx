import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { routing } from '@/i18n/routing'
import { pageMetadata, SITE_URL, type AppLocale } from '@/lib/site'
import { getPageBySlug } from '@/lib/pages'
import type { PricingPlan } from '@/lib/schema/builders/product'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { PricingJsonLd } from '@/components/JsonLd'
import { PageJsonLd } from '@/components/PageJsonLd'
import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/Hero'
import { TrustedBy } from '@/components/TrustedBy'
import { TheProblem } from '@/components/TheProblem'
import { Benefits } from '@/components/Benefits'
import { Pricing } from '@/components/Pricing'
import { Testimonials } from '@/components/Testimonials'
import { FAQ } from '@/components/FAQ'
import { Footer } from '@/components/Footer'

export function generateStaticParams() {
  return routing.locales.map((lang) => ({ lang }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const page = await getPageBySlug(lang, 'home')
  const t = await getTranslations({ locale: lang, namespace: 'seo.home' })

  return pageMetadata({
    locale: lang as AppLocale,
    path: '',
    title: page?.meta?.title || t('title'),
    description: page?.meta?.description || t('description'),
  })
}

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  setRequestLocale(lang)
  const t = await getTranslations({ locale: lang })

  const page = await getPageBySlug(lang, 'home')

  // Derive one Product-per-plan JSON-LD from the pricing block when present;
  // otherwise fall back to the i18n plan names + current monthly prices. Plans are
  // monthly subscriptions, so unitText is "per month"; pageUrl is the home canonical.
  const locale = lang as AppLocale
  const homeUrl = `${SITE_URL}/${lang}`
  const pricingBlock = page?.layout?.find((b) => b.blockType === 'pricing')
  const plans: PricingPlan[] =
    pricingBlock && 'plans' in pricingBlock && pricingBlock.plans?.length
      ? pricingBlock.plans.map((p) => ({
          name: p.name,
          price: p.price,
          description: p.description ?? p.name,
          unitText: 'per month',
          pageUrl: homeUrl,
        }))
      : [
          { name: t('pricing.plans.foundation.name'), price: '199', description: t('pricing.plans.foundation.name'), unitText: 'per month', pageUrl: homeUrl },
          { name: t('pricing.plans.engine.name'), price: '299', description: t('pricing.plans.engine.name'), unitText: 'per month', pageUrl: homeUrl },
          { name: t('pricing.plans.growth.name'), price: '699', description: t('pricing.plans.growth.name'), unitText: 'per month', pageUrl: homeUrl },
        ]

  const homeTitle = page?.meta?.title || t('seo.home.title')

  // CMS path: render the home from the seeded Page's blocks. The footer drops
  // its advantage card because the final CtaBlock renders it in-flow.
  if (page?.layout && page.layout.length > 0) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/30">
        <Navbar />
        <main className="flex-1">
          <RenderBlocks layout={page.layout} lang={lang} />
        </main>
        <Footer showAdvantage={false} />
        <PricingJsonLd plans={plans} locale={locale} />
        <PageJsonLd kind="home" locale={locale} url={homeUrl} title={homeTitle} />
      </div>
    )
  }

  // Fallback: no published home Page yet — render the original hardcoded
  // sections so the site never breaks.
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/30">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <TheProblem />
        <Benefits />
        <TrustedBy />
        <Testimonials />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
      <PricingJsonLd plans={plans} locale={locale} />
      <PageJsonLd kind="home" locale={locale} url={homeUrl} title={homeTitle} />
    </div>
  )
}
