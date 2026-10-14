import type { AppLocale } from '@/lib/site'
import type { Organization, WithContext } from 'schema-dts'
import { SITE_URL, SITE_NAME } from '@/lib/site'
import { IDS } from '@/lib/schema/ids'

/**
 * Brand logo, served from this domain (`public/brand/apturio-logo.png`, 1670x484) so the
 * Organization node does not depend on a third-party file host.
 */
const LOGO_URL = `${SITE_URL}/brand/apturio-logo.png`

/**
 * Real, verified Apturio profile URLs only: each one resolved and was confirmed to belong to
 * Apturio (checked 2026-10-13). Never add a URL that was not opened and confirmed.
 * Not included on purpose: `x.com/apturio` (404, the account does not exist), the WhatsApp
 * click-to-chat link and the payment-links host (neither is a profile of the entity), and
 * Facebook / Crunchbase / G2 / Capterra (no profile exists yet). Add those here once they do.
 */
const SAME_AS = [
  'https://www.linkedin.com/company/apturio',
  'https://www.instagram.com/apturio_official/',
  'https://www.youtube.com/@apturio',
]

const DESCRIPTION: Record<AppLocale, string> = {
  en:
    'Apturio delivers a Done-for-You AI-powered sales machine: a turnkey AI CRM that ' +
    'qualifies leads, manages your pipeline, and books appointments 24/7.',
  es:
    'Apturio entrega una máquina de ventas con IA llave en mano: un CRM con IA que ' +
    'califica leads, gestiona tu pipeline y agenda citas 24/7.',
}

/**
 * Canonical Organization node — single source of truth, rendered once in the
 * `[lang]` layout. Every other schema type references it via `{ '@id': IDS.organization }`
 * (never an inline Organization object — Pitfall 5).
 *
 * Pure builder: no JSX, no side effects, no Payload access. Description and `inLanguage`
 * follow the locale (Pitfall 7, enforced by scripts/validate-jsonld.mjs). schema.org scopes
 * `inLanguage` to CreativeWork, so the literal is asserted to `WithContext<Organization>`;
 * Google ignores the extra property.
 */
export function buildOrganization(locale: AppLocale): WithContext<Organization> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': IDS.organization,
    name: SITE_NAME,
    legalName: SITE_NAME,
    description: DESCRIPTION[locale],
    url: SITE_URL,
    inLanguage: locale,
    logo: {
      '@type': 'ImageObject',
      url: LOGO_URL,
      width: '1670',
      height: '484',
    },
    sameAs: SAME_AS,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      telephone: '+15614731298',
      availableLanguage: ['en', 'es'],
    },
  } as WithContext<Organization>
}
