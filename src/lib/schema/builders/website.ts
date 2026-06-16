import type { AppLocale } from '@/lib/site'
import type { WebSite, WithContext } from 'schema-dts'
import { SITE_URL, SITE_NAME } from '@/lib/site'
import { IDS } from '@/lib/schema/ids'

/**
 * Canonical WebSite node. Pure builder returning `WithContext<WebSite>` with a stable
 * `@id` anchor and locale-driven `inLanguage` (Pitfall 7 — never a literal).
 *
 * `publisher` is an `@id` cross-reference to the single canonical Organization node —
 * never an inline Organization object (Pitfall 5, threat T-14-05).
 */
export function buildWebSite(locale: AppLocale): WithContext<WebSite> {
  // SearchAction / Sitelinks Searchbox discontinued Nov 2024 — do NOT add potentialAction.
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': IDS.website,
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: locale,
    publisher: { '@id': IDS.organization },
  }
}
