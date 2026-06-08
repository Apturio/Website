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
} as const
