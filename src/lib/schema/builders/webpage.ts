import type { AppLocale } from '@/lib/site'
import type { ContactPage, WebPage, WithContext } from 'schema-dts'
import { IDS } from '@/lib/schema/ids'

export interface WebPageInput {
  locale: AppLocale
  /** Full locale-prefixed canonical URL, e.g. `https://apturio.com/en/pay-per-use`. */
  url: string
  title: string
  description?: string
  dateModified?: string
  datePublished?: string
  pageType?: 'WebPage' | 'ContactPage'
  /** v2.2.x slot — accepted but not emitted yet (see below). */
  workTranslation?: string[]
}

/**
 * Pure builder for a per-page `WebPage` (or `ContactPage` subtype) node. The `@id` is the
 * canonical URL + `#webpage` (via the per-page id factory). The page links to the single
 * canonical WebSite node by `@id` cross-reference — never an inline WebSite object
 * (Pitfall 5). `inLanguage` is driven by the required locale param (Pitfall 7).
 */
export function buildWebPage(input: WebPageInput): WithContext<WebPage | ContactPage> {
  return {
    '@context': 'https://schema.org',
    '@type': input.pageType ?? 'WebPage',
    '@id': IDS.webpage(input.url),
    url: input.url,
    name: input.title,
    ...(input.description ? { description: input.description } : {}),
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    inLanguage: input.locale,
    isPartOf: { '@id': IDS.website },
    // v2.2.x: workTranslation slot — emit when both locales published (Pitfall 8).
  }
}
