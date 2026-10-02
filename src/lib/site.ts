import type { Metadata } from 'next'

// Canonical production origin. Both apturio.com and the retired es.apturio.com
// now resolve to this single Vercel deployment; locale lives in the path.
export const SITE_URL = 'https://apturio.com'
export const SITE_NAME = 'Apturio'

// Guard every JSON-LD `@id` (built in @/lib/schema/ids) against double-slash
// corruption: a trailing slash on SITE_URL would yield `https://apturio.com//#organization`.
if (process.env.NODE_ENV !== 'test' && SITE_URL.endsWith('/')) {
  throw new Error('SITE_URL must not have a trailing slash — got: ' + SITE_URL)
}

export type AppLocale = 'en' | 'es'

/** English is the default locale and is served WITHOUT a URL prefix; Spanish lives under /es. */
export const DEFAULT_LOCALE: AppLocale = 'en'

/** URL prefix for a locale: '' for English, '/es' for Spanish. */
export function localePrefix(locale: string): string {
  return locale === DEFAULT_LOCALE ? '' : `/${locale}`
}

/**
 * Site-relative path for a locale. English is unprefixed:
 *   ('en') → '/'            ('es') → '/es'
 *   ('en','/blog') → '/blog'  ('es','/blog') → '/es/blog'
 *   ('en','#pricing') → '/#pricing'
 */
export function localePath(locale: string, path = ''): string {
  const prefix = localePrefix(locale)
  if (path === '' || path === '/') return prefix || '/'
  if (path.startsWith('#') || path.startsWith('?')) return `${prefix || '/'}${path}`
  return `${prefix}${path.startsWith('/') ? path : `/${path}`}`
}

/**
 * Normalizes an editor-authored internal link. Links saved while English lived
 * under `/en/...` become unprefixed; external URLs, anchors and `/es/...` pass through.
 */
export function cleanHref(href: string): string {
  const bare = href.replace(/^\/en(?=[/?#]|$)/, '')
  if (bare === href) return href
  // `/en#x` / `/en?x` must keep pointing at the home page, not the current one.
  return bare === '' || bare.startsWith('#') || bare.startsWith('?') ? `/${bare}` : bare
}

/** Absolute URL for a locale + path (see {@link localePath}). English home is `https://apturio.com/`. */
export function localeUrl(locale: string, path = ''): string {
  return `${SITE_URL}${localePath(locale, path)}`
}

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
  const canonical = localeUrl(locale, path)

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: localeUrl('en', path),
        es: localeUrl('es', path),
        'x-default': localeUrl('en', path),
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

/**
 * Build reciprocal hreflang alternates for a doc with LOCALIZED slugs. Given a
 * per-locale slug map (`{ en: 'foo', es: 'bar' }`) and a URL builder, emits one
 * `languages` entry per locale that has a stored slug, always self-canonical and
 * `x-default` → English (falling back to the canonical when EN is absent).
 */
export function localizedAlternates(
  selfLocale: AppLocale,
  slugMap: Record<string, string>,
  makeUrl: (locale: string, slug: string) => string,
): { canonical: string; languages: Record<string, string> } {
  const languages: Record<string, string> = {}
  for (const [loc, slug] of Object.entries(slugMap)) {
    languages[loc] = makeUrl(loc, slug)
  }
  const canonical = languages[selfLocale] ?? makeUrl(selfLocale, slugMap[selfLocale] ?? '')
  languages['x-default'] = languages['en'] ?? canonical
  return { canonical, languages }
}
