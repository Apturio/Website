import { JsonLdScript } from '@/components/JsonLdScript'
import { resolvePageSchemas, type PageJsonLdProps } from '@/lib/schema/dispatch'

/**
 * Server Component twin of `GlobalJsonLd` for per-page schema. Calls the pure
 * `resolvePageSchemas` dispatcher and maps each schema through the shared XSS-safe
 * `JsonLdScript` (the single serialization choke point — Pitfall 2).
 *
 * Defense-in-depth noindex guard (Pitfall 11 / T-15-11): when `noindex` is true this
 * early-returns `null` BEFORE dispatch runs, so noindex routes (checkout, thank-you)
 * emit no page-specific JSON-LD even if `<PageJsonLd>` is rendered by mistake. The
 * primary enforcement remains that noindex routes simply never render this component.
 */
export function PageJsonLd(props: PageJsonLdProps & { noindex?: boolean }) {
  if (props.noindex) return null

  const schemas = resolvePageSchemas(props)
  return (
    <>
      {schemas.map((s, i) => (
        <JsonLdScript key={i} data={s} />
      ))}
    </>
  )
}
