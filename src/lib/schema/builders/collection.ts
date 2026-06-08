import type { AppLocale } from '@/lib/site'
import type { CollectionPage, WithContext } from 'schema-dts'
import { IDS } from '@/lib/schema/ids'

/**
 * Input for {@link buildCollectionPage}. The caller resolves the locale-prefixed
 * canonical `url` and the listing `title`/`description`; `dateModified` is the most
 * recent item's update time when available (drives freshness signals).
 */
export interface CollectionPageInput {
  locale: AppLocale
  url: string
  title: string
  description?: string
  dateModified?: string
}

/**
 * CollectionPage for the blog index and category listing pages. Pure builder.
 *
 * Carries no stable `@id` of its own — it is a leaf listing page. `isPartOf` is an
 * `@id` cross-reference to the canonical WebSite node (Pitfall 5 — never inline a
 * WebSite object). `inLanguage` is driven by the required locale (Pitfall 7).
 */
export function buildCollectionPage(input: CollectionPageInput): WithContext<CollectionPage> {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: input.title,
    ...(input.description ? { description: input.description } : {}),
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
    url: input.url,
    inLanguage: input.locale,
    isPartOf: { '@id': IDS.website },
  }
}
