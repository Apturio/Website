import { getTranslations, setRequestLocale } from 'next-intl/server'

import { routing } from '@/i18n/routing'

export function generateStaticParams() {
  return routing.locales.map((lang) => ({ lang }))
}

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  setRequestLocale(lang)

  // Proves next-intl works server-side in both locales. Full page port is Phase 7.
  const t = await getTranslations('hero')

  return (
    <main className="container mx-auto px-6 py-24">
      <h1 className="text-4xl font-heading font-bold">{t('title')}</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">{t('description')}</p>
    </main>
  )
}
