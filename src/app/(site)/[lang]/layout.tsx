import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Inter, Outfit } from 'next/font/google'

import { routing } from '@/i18n/routing'
import { SITE_URL } from '@/lib/site'
import type { AppLocale } from '@/lib/site'
import { GlobalJsonLd } from '@/components/GlobalJsonLd'
import { WhatsAppFloat } from '@/components/WhatsAppFloat'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import '../../globals.css'
import '@/styles/service-blocks.css'

// Self-hosted at build time (no render-blocking request to fonts.googleapis.com).
const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' })
// `optional`: headings never swap fonts mid-paint (swap re-flowed the hero: CLS + a late LCP candidate).
const outfit = Outfit({ subsets: ['latin'], display: 'optional', variable: '--font-outfit' })

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

  // Only the namespaces read by Client Components (NavbarClient: nav + footer, FAQ: faq) are
  // serialized into the page; the rest of the catalog is used on the server only.
  const allMessages = (await getMessages()) as Record<string, unknown>
  const messages = Object.fromEntries(
    ['nav', 'footer', 'faq'].filter((ns) => ns in allMessages).map((ns) => [ns, allMessages[ns]]),
  )

  return (
    <html lang={lang} data-scroll-behavior="smooth" className={`${inter.variable} ${outfit.variable}`}>
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
