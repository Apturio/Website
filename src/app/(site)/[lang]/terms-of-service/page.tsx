import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { routing } from '@/i18n/routing'
import { pageMetadata, SITE_URL, type AppLocale } from '@/lib/site'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
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
  const t = await getTranslations({ locale: lang, namespace: 'seo.terms' })
  return pageMetadata({
    locale: lang as AppLocale,
    path: '/terms-of-service',
    title: t('title'),
    description: t('description'),
  })
}

export default async function TermsOfServicePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  setRequestLocale(lang)
  const t = await getTranslations({ locale: lang })
  const content = t.raw('terms.content') as { title: string; text: string }[]

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-32 max-w-4xl">
        <h1 className="text-4xl font-bold mb-4 font-heading text-white">{t('terms.title')}</h1>
        <p className="text-muted-foreground mb-8">{t('terms.lastUpdated')}</p>

        <div className="space-y-8">
          {Array.isArray(content) && content.map((item, index) => (
            <section key={index}>
              <h2 className="text-2xl font-semibold mb-4 text-primary">{item.title}</h2>
              <p className="text-slate-300 leading-relaxed">{item.text}</p>
            </section>
          ))}
        </div>
      </main>
      <Footer />
      <PageJsonLd
        kind="legal"
        locale={lang as AppLocale}
        url={`${SITE_URL}/${lang}/terms-of-service`}
        title={t('terms.title')}
      />
    </div>
  )
}
