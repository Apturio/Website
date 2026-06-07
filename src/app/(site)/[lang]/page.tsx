import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { routing } from '@/i18n/routing'
import { pageMetadata, type AppLocale } from '@/lib/site'
import { PricingJsonLd } from '@/components/JsonLd'
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
  const t = await getTranslations({ locale: lang, namespace: 'seo.home' })
  return pageMetadata({
    locale: lang as AppLocale,
    path: '',
    title: t('title'),
    description: t('description'),
  })
}

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  setRequestLocale(lang)
  const t = await getTranslations({ locale: lang })

  const offers = [
    { name: t('pricing.plans.foundation.name'), price: '199' },
    { name: t('pricing.plans.engine.name'), price: '299' },
    { name: t('pricing.plans.growth.name'), price: '699' },
  ]

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
      <PricingJsonLd offers={offers} />
    </div>
  )
}
