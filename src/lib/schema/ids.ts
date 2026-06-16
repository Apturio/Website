import { SITE_URL } from '@/lib/site'

/**
 * Stable, locale-independent `@id` anchors for the global schema entities.
 *
 * These IRIs are fragment identifiers on the canonical origin (no trailing slash,
 * no locale segment) so that Organization / WebSite / SoftwareApplication keep a
 * single stable identity across `/en` and `/es` and across every page that
 * cross-references them via `{ '@id': IDS.* }`. Correctness depends on `SITE_URL`
 * having no trailing slash — enforced by the module-load assertion in `@/lib/site`.
 *
 * With `SITE_URL = 'https://apturio.com'` these resolve to single-slash fragments,
 * e.g. `https://apturio.com/#organization`.
 */
export const IDS = {
  organization: `${SITE_URL}/#organization`,
  website: `${SITE_URL}/#website`,
  softwareApp: `${SITE_URL}/#software-app`,
  // Per-page @id factories. The argument is the FULL locale-prefixed canonical URL
  // (e.g. `https://apturio.com/en/pay-per-use`), built by callers as
  // `${SITE_URL}/${locale}/${path}`. SITE_URL has no trailing slash (asserted in
  // @/lib/site) so no `@id` ever contains a `//` (Pitfall 6).
  webpage: (url: string) => `${url}#webpage`,
  breadcrumb: (url: string) => `${url}#breadcrumb`,
  person: (authorUrl: string) => `${authorUrl}#person`,
} as const
