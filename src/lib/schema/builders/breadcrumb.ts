import type { AppLocale } from '@/lib/site'
import type { BreadcrumbList, WithContext } from 'schema-dts'

/**
 * Localized label for the breadcrumb root. Callers MUST pass
 * `{ name: HOME_LABEL[locale], url: `${SITE_URL}/${locale}` }` as `items[0]` —
 * this builder NEVER silently injects Home (Anti-Pattern: breadcrumb sin Home).
 */
export const HOME_LABEL: Record<AppLocale, string> = { en: 'Home', es: 'Inicio' }

export interface BreadcrumbItem {
  name: string
  url: string
}

/**
 * Pure builder for a Home-first `BreadcrumbList`. The CALLER supplies the full,
 * already-ordered list (Home → … → current page) — the builder does not auto-prepend
 * Home and does not perform any `SITE_URL`/locale routing (ARCHITECTURE Pattern 4,
 * "caller passes the full list").
 *
 * `BreadcrumbList` is the one schema type that carries no language signal. Each emitted
 * `ListItem` carries `position`, `name`, and `item` — all three are required by Google
 * (Pitfall 10).
 */
export function buildBreadcrumbList(
  items: BreadcrumbItem[],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  locale: AppLocale,
): WithContext<BreadcrumbList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
