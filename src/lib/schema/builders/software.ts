import type { AppLocale } from '@/lib/site'
import type { SoftwareApplication, WithContext } from 'schema-dts'
import { SITE_URL, SITE_NAME } from '@/lib/site'
import { IDS } from '@/lib/schema/ids'

/**
 * Brand logo reused as the application screenshot, served from this domain.
 * TODO: replace with a real product UI screenshot once one is published.
 */
const SCREENSHOT = `${SITE_URL}/brand/apturio-logo.png`

const DESCRIPTION: Record<AppLocale, string> = {
  en: 'AI CRM with WhatsApp and Instagram chatbots that qualifies leads, manages your sales pipeline and books appointments 24/7.',
  es: 'CRM con IA y chatbots de WhatsApp e Instagram que califica leads, gestiona tu pipeline de ventas y agenda citas 24/7.',
}

/**
 * Canonical SoftwareApplication node for the Apturio AI CRM. Pure builder returning
 * `WithContext<SoftwareApplication>` with a stable `@id` anchor and locale-driven
 * `inLanguage` (Pitfall 7 — never a literal).
 *
 * No global `offers` block — per-page price markup lives in `PricingJsonLd`, bound to the
 * displayed plan prices (content-match — Pitfall 1). No `aggregateRating`/`review`
 * (Pitfall 4, threat T-14-03).
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
    description: DESCRIPTION[locale],
    publisher: { '@id': IDS.organization },
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
    // No global Offer: price markup lives in PricingJsonLd, bound to the
    // price visible on each pricing surface (content-match — Pitfall 1).
    // TODO(v2.3): aggregateRating only after verified G2/Capterra profile with ≥5 reviews (Pitfall 4)
  }
}
