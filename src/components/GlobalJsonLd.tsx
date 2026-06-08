import type { AppLocale } from '@/lib/site'

import { JsonLdScript } from '@/components/JsonLdScript'
import { buildOrganization } from '@/lib/schema/builders/organization'
import { buildWebSite } from '@/lib/schema/builders/website'
import { buildSoftwareApplication } from '@/lib/schema/builders/software'

/**
 * Renders the three global schemas (Organization, WebSite, SoftwareApplication)
 * as three separate JSON-LD `<script>` tags, with `inLanguage` driven by the
 * route locale. Rendered once in the [lang] layout.
 */
export function GlobalJsonLd({ locale }: { locale: AppLocale }) {
  return (
    <>
      <JsonLdScript data={buildOrganization(locale)} />
      <JsonLdScript data={buildWebSite(locale)} />
      <JsonLdScript data={buildSoftwareApplication(locale)} />
    </>
  )
}
