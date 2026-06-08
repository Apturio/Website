import type { AppLocale } from '@/lib/site'
import type { ContactPage, WithContext } from 'schema-dts'
import { IDS } from '@/lib/schema/ids'

export interface ContactPageInput {
  locale: AppLocale
  /** Full locale-prefixed canonical URL, e.g. `https://apturio.com/en/strategy-call`. */
  url: string
  title: string
  description?: string
}

/**
 * Pure builder for the `ContactPage` on `/strategy-call`. A `ContactPage` is a `WebPage`
 * subtype, so it shares the same `@id` (IDS.webpage), `isPartOf` `@id` ref to WebSite, and
 * locale-driven `inLanguage` as buildWebPage — plus a `contactPoint` (the US support line,
 * copied from organization.ts). Never re-emits an inline Organization (Pitfall 5).
 *
 * Note: schema-dts scopes `inLanguage` to `CreativeWork`. `ContactPage` is a `WebPage`
 * (a `CreativeWork`), so `inLanguage` is declared directly. `contactPoint` is not declared
 * on `WebPage` in schema-dts, so the literal is asserted to `WithContext<ContactPage>` —
 * the same narrow cast organization.ts uses (line 64). The cast only suppresses the
 * excess-property check; every declared field is still type-checked.
 */
export function buildContactPage(input: ContactPageInput): WithContext<ContactPage> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    '@id': IDS.webpage(input.url),
    url: input.url,
    name: input.title,
    ...(input.description ? { description: input.description } : {}),
    inLanguage: input.locale,
    isPartOf: { '@id': IDS.website },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      telephone: '+15614731298',
      availableLanguage: ['en', 'es'],
    },
  } as WithContext<ContactPage>
}
