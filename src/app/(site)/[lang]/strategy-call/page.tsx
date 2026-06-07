import type { Metadata } from 'next'
import Script from 'next/script'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { routing } from '@/i18n/routing'
import { pageMetadata, type AppLocale } from '@/lib/site'
import { Navbar } from '@/components/Navbar'
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
  const t = await getTranslations({ locale: lang, namespace: 'seo.strategy' })
  return pageMetadata({
    locale: lang as AppLocale,
    path: '/strategy-call',
    title: t('title'),
    description: t('description'),
  })
}

export default async function StrategyCallPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  setRequestLocale(lang)
  const t = await getTranslations({ locale: lang })

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/30">
      <Navbar />
      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">{t('strategy.title')}</h1>
            <p className="text-slate-400 text-lg">{t('strategy.subtitle')}</p>
          </div>
          <div className="bg-card border border-border rounded-[20px] overflow-hidden shadow-[0_0_30px_rgba(120,125,255,0.05)]">
            <iframe
              src="https://links.apturio.com/widget/bookings/apturio-consulting-session"
              style={{ width: '100%', border: 'none', overflow: 'hidden', minHeight: '800px' }}
              scrolling="no"
              id="msgsndr-calendar"
              title="Apturio Strategy Call Booking"
            />
          </div>
        </div>
      </main>
      <Footer />
      <Script src="https://link.msgsndr.com/js/form_embed.js" strategy="afterInteractive" />
    </div>
  )
}
