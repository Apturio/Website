import type { AppLocale } from '@/lib/site'
import type { Product, WithContext } from 'schema-dts'
import { IDS } from '@/lib/schema/ids'

/**
 * Input for a single pricing plan → one `Product` node.
 *
 * `price` is the displayed price (may carry currency symbols, e.g. "$199"); it is
 * scrubbed to a bare numeric string for the Offer (Pitfall 1 content-match). `unitText`
 * is the human billing unit (e.g. "per month") emitted on the nested
 * `UnitPriceSpecification`.
 */
export interface PricingPlan {
  name: string
  description: string
  /** Displayed price — "$199" or "199"; scrubbed to digits for the Offer. */
  price: string
  /** ISO 4217 currency; defaults to USD (Google-required — Pitfall 10). */
  priceCurrency?: string
  /** Billing unit, e.g. "per month". */
  unitText: string
  imageUrl?: string
  /** Canonical URL of the pricing surface this plan is offered on. */
  pageUrl: string
}

/**
 * Builds ONE `Product` node for ONE pricing plan, with an `Offer` carrying
 * `price` + `priceCurrency` + a nested `UnitPriceSpecification`.
 *
 * This fixes the legacy anti-pattern (`PricingJsonLd` wrapped ALL plans in a single
 * Product) — callers map an array of plans to an array of Products (one per plan).
 *
 * Pure builder: no JSX, no side effects, no Payload access. `inLanguage` is driven by
 * the required `locale` param (Pitfall 7) — never a string literal. `brand` is an `@id`
 * cross-reference to the canonical Organization node — never an inline Organization
 * object (Pitfall 5, threat T-15-03).
 *
 * Note: schema.org scopes `inLanguage` to `CreativeWork`, so schema-dts's `Product`
 * type does not declare it. The locale-driven language signal is required on every node
 * (Pitfall 7), so the literal is asserted to `WithContext<Product>` — mirroring
 * `organization.ts`. The cast only suppresses the excess-property check; every declared
 * field is still type-checked against schema-dts.
 */
export function buildProduct(
  plan: PricingPlan,
  locale: AppLocale,
): WithContext<Product> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: plan.name,
    description: plan.description,
    ...(plan.imageUrl ? { image: plan.imageUrl } : {}),
    // @id ref to the canonical Organization node — never inline (Pitfall 5).
    brand: { '@id': IDS.organization },
    inLanguage: locale,
    offers: {
      '@type': 'Offer',
      // "$199" → "199" — REUSE the legacy scrub (content-match, Pitfall 1).
      price: plan.price.replace(/[^0-9.]/g, ''),
      // Google-required on every Offer (Pitfall 10).
      priceCurrency: plan.priceCurrency ?? 'USD',
      availability: 'https://schema.org/InStock',
      url: plan.pageUrl,
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: plan.price.replace(/[^0-9.]/g, ''),
        priceCurrency: plan.priceCurrency ?? 'USD',
        unitText: plan.unitText,
      },
    },
  } as WithContext<Product>
}
