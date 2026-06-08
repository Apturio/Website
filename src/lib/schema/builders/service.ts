import type { AppLocale } from '@/lib/site'
import type { Service, WithContext } from 'schema-dts'
import { IDS } from '@/lib/schema/ids'

/**
 * Input for a `Service` node, emitted on Payload landing/service pages.
 *
 * The route resolves Payload fields → primitives (`name` = page.title,
 * `description` = page.meta?.description) and passes them in; the builder stays pure.
 */
export interface ServiceInput {
  locale: AppLocale
  /** Canonical locale-prefixed URL of the landing page. */
  url: string
  name: string
  description?: string
  serviceType?: string
}

/**
 * Builds a `Service` node whose `provider` is the global Organization `@id`.
 *
 * Service on landing pages is a competitor differentiator (SCHEMA-09) — no competitor
 * emits it. Pure builder: no JSX, no side effects, no Payload access. `inLanguage` is
 * driven by the required `locale` (Pitfall 7). `provider` is an `@id` cross-reference to
 * the canonical Organization node — never an inline Organization object (Pitfall 5,
 * threat T-15-03).
 *
 * The Service carries NO stable `@id` of its own (ARCHITECTURE "What DOES NOT get a
 * stable @id"): it is page-scoped, not a globally referenced entity.
 *
 * Note: schema.org scopes `inLanguage` to `CreativeWork`, so schema-dts's `Service`
 * type does not declare it. The locale-driven language signal is required on every node
 * (Pitfall 7), so the literal is asserted to `WithContext<Service>` — mirroring
 * `organization.ts`. The cast only suppresses the excess-property check; every declared
 * field is still type-checked against schema-dts.
 */
export function buildService(input: ServiceInput): WithContext<Service> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: input.name,
    ...(input.description ? { description: input.description } : {}),
    ...(input.serviceType ? { serviceType: input.serviceType } : {}),
    url: input.url,
    inLanguage: input.locale,
    // @id ref to the canonical Organization node — never inline (Pitfall 5).
    provider: { '@id': IDS.organization },
  } as WithContext<Service>
}
