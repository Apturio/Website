import type { AppLocale } from '@/lib/site'
import type { SoftwareApplication, WithContext } from 'schema-dts'
import { SITE_URL, SITE_NAME } from '@/lib/site'
import { IDS } from '@/lib/schema/ids'

/**
 * Brand logo (R2/filesafe asset) reused as the application screenshot. It is a real,
 * Apturio-owned image URL — never fabricated. Swap for a genuine product UI screenshot
 * once one is published.
 * TODO(v2.2.x): replace with a real product screenshot asset (logo is a placeholder).
 */
const SCREENSHOT =
  'https://vibe.filesafe.space/1775831502235366632/attachments/965b91f8-1e00-4fc8-acf4-8021d0d6fdcd.png'

/**
 * Canonical SoftwareApplication node for the Apturio AI CRM. Pure builder returning
 * `WithContext<SoftwareApplication>` with a stable `@id` anchor and locale-driven
 * `inLanguage` (Pitfall 7 — never a literal).
 *
 * The `offers` block carries both `price` and `priceCurrency` (Google requires both for
 * price display — Pitfall 10). No `aggregateRating`/`review` (Pitfall 4, threat T-14-03).
 */
export function buildSoftwareApplication(
  locale: AppLocale,
): WithContext<SoftwareApplication> {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': IDS.softwareApp,
    name: SITE_NAME,
    url: SITE_URL,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    inLanguage: locale,
    featureList: [
      'AI-powered lead qualification',
      'Sales pipeline management',
      '24/7 automated appointment booking',
      'Done-for-You AI CRM setup',
    ],
    screenshot: SCREENSHOT,
    // Served from the United States (US-based support line +1 561). Expand only with
    // verified served countries — no speculative ISO codes.
    countriesSupported: 'US',
    offers: {
      '@type': 'Offer',
      price: '199',
      priceCurrency: 'USD', // required by Google alongside price (Pitfall 10)
    },
    // TODO(v2.3): aggregateRating only after verified G2/Capterra profile with ≥5 reviews (Pitfall 4)
  }
}
