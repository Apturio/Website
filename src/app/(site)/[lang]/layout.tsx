import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'

import { routing } from '@/i18n/routing'
import { SITE_URL } from '@/lib/site'
import type { AppLocale } from '@/lib/site'
import { GlobalJsonLd } from '@/components/GlobalJsonLd'
import { WhatsAppFloat } from '@/components/WhatsAppFloat'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import '../../globals.css'
import '@/styles/service-blocks.css'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
}

export function generateStaticParams() {
  return routing.locales.map((lang) => ({ lang }))
}

// `dynamicParams = false` on this top-level `[lang]` segment crashes legit
// requests with `Internal: NoFallbackError` on Next.js 16.2.7
// (vercel/next.js#84738). Left `true` (the default); the `hasLocale` + `notFound()`
// check below still rejects invalid locales (e.g. `/favicon.ico`), just slightly
// later in the request lifecycle.
export const dynamicParams = true

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params

  if (!hasLocale(routing.locales, lang)) {
    notFound()
  }

  // Enable static rendering for this locale.
  setRequestLocale(lang)

  const messages = await getMessages()

  return (
    <html lang={lang} data-scroll-behavior="smooth">
      <body>
        <NextIntlClientProvider messages={messages}>
          <LivePreviewListener />
          {children}
          <WhatsAppFloat locale={lang} />
        </NextIntlClientProvider>
        <GlobalJsonLd locale={lang as AppLocale} />
      </body>
    </html>
  )
}
