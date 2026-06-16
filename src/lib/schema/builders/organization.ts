import type { AppLocale } from '@/lib/site'
import type { Organization, WithContext } from 'schema-dts'
import { SITE_URL, SITE_NAME } from '@/lib/site'
import { IDS } from '@/lib/schema/ids'

/**
 * Brand logo (R2/filesafe asset). Carried over from the legacy `JsonLd.tsx`
 * Organization block; leaves `JsonLd.tsx` for good in Plan 03.
 */
const LOGO =
  'https://vibe.filesafe.space/1775831502235366632/attachments/965b91f8-1e00-4fc8-acf4-8021d0d6fdcd.png'

/**
 * Real, verified Apturio profile/identity URLs only — never fabricated (Pitfall 5,
 * threat T-14-05). WhatsApp click-to-chat + the canonical links hub are carried over
 * from the legacy block; LinkedIn + X are the genuine social profiles seeded into the
 * Authors collection (`src/seed.ts` socials.{linkedin,x}).
 *
 * GAP: sameAs has 4 < 5 real profiles — no fabricated URLs added (CONTEXT.md L84).
 * Expand to ≥5 once a verified Instagram/Facebook/YouTube profile exists.
 */
const SAME_AS = [
  'https://www.linkedin.com/company/apturio',
  'https://x.com/apturio',
  'https://links.apturio.com',
  'https://wa.me/15614731298',
]

/**
 * Canonical Organization node — single source of truth, rendered once in the
 * `[lang]` layout. Every other schema type references it via `{ '@id': IDS.organization }`
 * (never an inline Organization object — Pitfall 5).
 *
 * Pure builder: no JSX, no side effects, no Payload access. `inLanguage` is driven by
 * the required `locale` param (Pitfall 7) — never a string literal.
 *
 * Note: schema.org scopes `inLanguage` to `CreativeWork`, so schema-dts's `Organization`
 * type does not declare it. CONTEXT.md L48 / Pitfall 7 nonetheless require the
 * locale-driven language signal on the Organization node (Google ignores the extra
 * property gracefully), so the literal is asserted to `WithContext<Organization>`. The
 * cast only suppresses the excess-property check — every declared field is still
 * type-checked against schema-dts.
 */
export function buildOrganization(locale: AppLocale): WithContext<Organization> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': IDS.organization,
    name: SITE_NAME,
    legalName: SITE_NAME,
    description:
      'Apturio delivers a Done-for-You AI-powered sales machine: a turnkey AI CRM that ' +
      'qualifies leads, manages your pipeline, and books appointments 24/7.',
    url: SITE_URL,
    logo: LOGO,
    inLanguage: locale,
    sameAs: SAME_AS,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      telephone: '+15614731298',
      availableLanguage: ['en', 'es'],
    },
  } as WithContext<Organization>
}
