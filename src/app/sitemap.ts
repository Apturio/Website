import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

// Indexable static routes (paths after the locale segment). noindex routes
// (checkout, thank-you, demo funnel) are intentionally excluded.
const STATIC_PATHS = [
  '',
  '/pay-per-use',
  '/add-ons',
  '/strategy-call',
  '/privacy-policy',
  '/terms-of-service',
] as const

const LOCALES = ['en', 'es'] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  for (const path of STATIC_PATHS) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: path === '' ? 1 : 0.7,
        alternates: {
          languages: {
            en: `${SITE_URL}/en${path}`,
            es: `${SITE_URL}/es${path}`,
            'x-default': `${SITE_URL}/en${path}`,
          },
        },
      })
    }
  }

  return entries
}
