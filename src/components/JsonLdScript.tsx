import type { Thing, WithContext } from 'schema-dts'

import { safeSerialize } from '@/lib/schema/serialize'

/**
 * Server Component: emits a single JSON-LD `<script>`. All serialization routes
 * through `safeSerialize`, which neutralizes `</script>` breakout from any
 * (current or future CMS-sourced) string flowing into the schema object.
 */
export function JsonLdScript({ data }: { data: WithContext<Thing> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeSerialize(data) }}
    />
  )
}
