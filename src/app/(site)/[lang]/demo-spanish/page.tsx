import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'

import { routing } from '@/i18n/routing'
import { pageMetadata, SITE_URL, type AppLocale } from '@/lib/site'
import { DemoForm } from '@/components/DemoForm'
import { PageJsonLd } from '@/components/PageJsonLd'

export function generateStaticParams() {
  return routing.locales.map((lang) => ({ lang }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  return pageMetadata({
    locale: lang as AppLocale,
    path: '/demo-spanish',
    title: 'Solicita tu Demo - Apturio',
    description: 'Obtén una demostración exclusiva de nuestro sistema de ventas CRM con Inteligencia Artificial.',
    noindex: true,
  })
}

export default async function DemoSpanishPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  setRequestLocale(lang)

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 selection:bg-primary/30">
      <DemoForm locale={lang} />
      {/* This route is noindex (see generateMetadata). PageJsonLd is wired for the
          'demo' kind but the noindex guard suppresses emission — no schema on a
          noindex page (Pitfall 11 / T-15-13). */}
      <PageJsonLd
        kind="demo"
        noindex
        locale={lang as AppLocale}
        url={`${SITE_URL}/${lang}/demo-spanish`}
        title="Solicita tu Demo"
      />
    </div>
  )
}
