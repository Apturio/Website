import type { Metadata } from 'next'

// Canonical production origin. Both apturio.com and the retired es.apturio.com
// now resolve to this single Vercel deployment; locale lives in the path.
export const SITE_URL = 'https://apturio.com'
export const SITE_NAME = 'Apturio'

export type AppLocale = 'en' | 'es'

interface PageMetaInput {
  locale: AppLocale
  /** Path AFTER the locale segment, e.g. '' for home or '/pay-per-use'. */
  path: string
  title: string
  description: string
  noindex?: boolean
}

/**
 * Builds per-route Metadata with an absolute canonical, reciprocal hreflang
 * (en/es + x-default→en), and OG/Twitter tags. Replaces the old `useSEO` hook.
 */
export function pageMetadata({
  locale,
  path,
  title,
  description,
  noindex = false,
}: PageMetaInput): Metadata {
  const canonical = `${SITE_URL}/${locale}${path}`

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: `${SITE_URL}/en${path}`,
        es: `${SITE_URL}/es${path}`,
        'x-default': `${SITE_URL}/en${path}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: locale === 'es' ? 'es_ES' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  }
}
