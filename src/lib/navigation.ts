/**
 * Shared navigation data-access module (NAVCMS-05, NAVCMS-06).
 *
 * Single source of truth consumed by both Navbar and Footer: fetches the
 * Payload "navigation" Global (cached under the 'navigation' cache tag so
 * revalidateTag('navigation') — fired by the Global's afterChange hook,
 * see src/globals/Navigation.ts — invalidates it site-wide on publish) and
 * adapts it into a locale-resolved NavigationView view-model.
 *
 * Resilience (23-CONTEXT.md, informed by a real Postgres/VPN outage): if the
 * Global fetch throws or returns an unusable/empty Global, this module falls
 * back silently to the static nav-links.ts registry (resolved via the
 * caller-provided translator) so the site is NEVER left without navigation
 * during a DB outage. nav-links.ts is not deleted — it becomes the emergency
 * fallback, not the primary source. Both code paths emit the identical
 * NavigationView shape so downstream renderers cannot tell which one ran.
 */

import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'

import type { Navigation } from '@/payload-types'
import {
  navMenus as staticNavMenus,
  navDirectLinks as staticNavDirectLinks,
  footerColumns as staticFooterColumns,
  type NavLink as StaticNavLink,
  type NavMenu as StaticNavMenu,
  type FooterColumn as StaticFooterColumn,
} from '@/lib/nav-links'

export interface NavItemView {
  /**
   * Stable identity for this row: the Payload-generated array-row id when
   * sourced from the Global, or an index-synthesized id when sourced from
   * the static nav-links.ts fallback (WR-01) — `label` is admin-editable
   * free text with no uniqueness constraint, so it must never be used alone
   * as a React `key` or Radix Accordion `value`.
   */
  id?: string
  label: string
  href?: string
  status: 'live' | 'comingSoon'
  icon?: string
  description?: string
  children?: NavItemView[]
}

export interface NavMenuView {
  id?: string
  triggerLabel: string
  columns: { id?: string; label?: string; items: NavItemView[] }[]
}

export interface FooterColumnView {
  id?: string
  heading: string
  items: NavItemView[]
  subgroup?: { heading: string; items: NavItemView[] }
}

export interface NavigationView {
  megaMenus: NavMenuView[]
  directLinks: NavItemView[]
  footerColumns: FooterColumnView[]
}

/**
 * Re-exported from `./nav-href` (not defined here) so Client Components can
 * value-import it without pulling this module's server-only dependencies
 * (`getPayload`/`payload.config`) into the client bundle. See nav-href.ts.
 */
export { isExternalHref } from "./nav-href"

/** Resolves a translation key (or nav-links.ts label/description) to display text. */
type Translator = (key: string) => string

/** Structural shape shared by every raw item across megaMenus/directLinks/footerColumns. */
interface RawItemLike {
  id?: string | null
  label: string
  href?: string | null
  status: 'live' | 'comingSoon'
  icon?: string | null
  description?: string | null
  children?: RawItemLike[] | null
}

// Cached read of the raw Navigation Global, keyed per-locale by unstable_cache.
// Deliberately has NO try/catch of its own: a thrown DB error must propagate
// uncached so unstable_cache never memoizes a failure — recovery is automatic
// the next time the DB is reachable. Only successful reads are stored under
// the 'navigation' tag, which the Plan 01 revalidateNavigation hook
// invalidates on every Global publish.
const getCachedNavigationGlobal = unstable_cache(
  async (locale: string): Promise<Navigation> => {
    const payload = await getPayload({ config })
    return payload.findGlobal({
      slug: 'navigation',
      locale: locale as 'en' | 'es',
      depth: 0,
    })
  },
  ['navigation-global'],
  { tags: ['navigation'] },
)

function adaptRawItem(item: RawItemLike): NavItemView {
  return {
    id: item.id ?? undefined,
    label: item.label,
    href: item.href ?? undefined,
    status: item.status,
    icon: item.icon ?? undefined,
    description: item.description ?? undefined,
    children: item.children ? item.children.map(adaptRawItem) : undefined,
  }
}

function adaptGlobalToView(raw: Navigation): NavigationView {
  return {
    megaMenus: (raw.megaMenus ?? []).map((menu) => ({
      id: menu.id ?? undefined,
      triggerLabel: menu.triggerLabel,
      columns: (menu.columns ?? []).map((column) => ({
        id: column.id ?? undefined,
        label: column.columnLabel ?? undefined,
        items: (column.items ?? []).map(adaptRawItem),
      })),
    })),
    directLinks: (raw.directLinks ?? []).map(adaptRawItem),
    footerColumns: (raw.footerColumns ?? []).map((column) => ({
      id: column.id ?? undefined,
      heading: column.heading,
      items: (column.items ?? []).map(adaptRawItem),
      subgroup: column.subgroupHeading
        ? {
            heading: column.subgroupHeading,
            items: (column.subgroupItems ?? []).map(adaptRawItem),
          }
        : undefined,
    })),
  }
}

// WR-01: the static nav-links.ts registry has no Payload-generated row ids,
// but its labelKey/triggerLabelKey/headingKey strings ARE developer-controlled
// and structurally unique (they were the pre-migration React `key` values —
// see git history on Navbar.tsx before the Payload Global swap), so they are
// reused here as a stable id fallback for the emergency static path.
function adaptStaticItem(t: Translator, item: StaticNavLink): NavItemView {
  return {
    id: item.labelKey,
    label: t(item.labelKey),
    href: item.href,
    status: item.status,
    icon: item.icon,
    description: item.descriptionKey ? t(item.descriptionKey) : undefined,
    children: item.children ? item.children.map((child) => adaptStaticItem(t, child)) : undefined,
  }
}

function adaptStaticMenu(t: Translator, menu: StaticNavMenu): NavMenuView {
  return {
    id: menu.triggerLabelKey,
    triggerLabel: t(menu.triggerLabelKey),
    columns: menu.columns.map((column, colIdx) => ({
      id: column.labelKey ?? `col-${colIdx}`,
      label: column.labelKey ? t(column.labelKey) : undefined,
      items: column.items.map((item) => adaptStaticItem(t, item)),
    })),
  }
}

function adaptStaticFooterColumn(t: Translator, column: StaticFooterColumn): FooterColumnView {
  return {
    id: column.headingKey,
    heading: t(column.headingKey),
    items: column.items.map((item) => adaptStaticItem(t, item)),
    subgroup: column.subgroup
      ? {
          heading: t(column.subgroup.headingKey),
          items: column.subgroup.items.map((item) => adaptStaticItem(t, item)),
        }
      : undefined,
  }
}

/** Adapts nav-links.ts (the emergency fallback registry) into a NavigationView. */
function getStaticNavigationView(t: Translator): NavigationView {
  return {
    megaMenus: staticNavMenus.map((menu) => adaptStaticMenu(t, menu)),
    directLinks: staticNavDirectLinks.map((item) => adaptStaticItem(t, item)),
    footerColumns: staticFooterColumns.map((column) => adaptStaticFooterColumn(t, column)),
  }
}

/**
 * Returns the resolved NavigationView for `locale`: the editable Payload
 * Global when it can be read and has usable content, otherwise the static
 * nav-links.ts fallback (resolved via `t`). Both branches emit the identical
 * NavigationView shape.
 */
export async function getNavigationView(
  locale: string,
  t: Translator,
): Promise<NavigationView> {
  try {
    const raw = await getCachedNavigationGlobal(locale)
    if (Array.isArray(raw?.megaMenus) && raw.megaMenus.length > 0) {
      return adaptGlobalToView(raw)
    }
    console.warn(
      `[lib/navigation] Navigation Global has no usable megaMenus for locale "${locale}" — falling back to static nav-links.ts registry.`,
    )
  } catch (error) {
    console.warn(
      `[lib/navigation] Failed to read Navigation Global for locale "${locale}" — falling back to static nav-links.ts registry.`,
      error,
    )
  }
  return getStaticNavigationView(t)
}
