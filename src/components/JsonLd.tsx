import type { AppLocale } from '@/lib/site'

import { buildProduct, type PricingPlan } from '@/lib/schema/builders/product'
import { JsonLdScript } from '@/components/JsonLdScript'

/**
 * One `Product` per pricing plan (fixes the legacy single-Product-wrapping-all-offers
 * anti-pattern) with locale-driven `inLanguage` (IN-01 fix). Each plan is mapped through
 * the pure `buildProduct` builder and rendered through the shared XSS-safe `JsonLdScript`
 * (the single serialization choke point — Pitfall 2). Rendered on pricing surfaces (home).
 */
export function PricingJsonLd({ plans, locale }: { plans: PricingPlan[]; locale: AppLocale }) {
  return (
    <>
      {plans.map((plan, i) => (
        <JsonLdScript key={i} data={buildProduct(plan, locale)} />
      ))}
    </>
  )
}
