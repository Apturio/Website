/**
 * One-off seed: Navigation Global (EN + ES), zero content regression (NAVCMS-07).
 *
 * Populates the `navigation` Payload Global with the EXACT current content of
 * `src/lib/nav-links.ts`, resolving every i18n key to its real EN/ES string
 * from `messages/en.json` / `messages/es.json`. Writes EN first (establishes
 * structure/order/non-localized fields), then ES (localized label/description
 * /heading text, keeping href/status/icon/order identical). Self-verifies by
 * reading the Global back per locale and asserting item counts + non-empty
 * labels, exiting non-zero on any mismatch.
 *
 * Run with: payload run src/seed-navigation.ts
 * Standalone — does not touch any other Global or collection.
 */
import { getPayload } from 'payload'
import config from '@payload-config'

import {
  navMenus,
  navDirectLinks,
  footerColumns as sourceFooterColumns,
  type NavLink,
} from './lib/nav-links'
import en from '../messages/en.json'
import es from '../messages/es.json'

type Lang = 'en' | 'es'
type Messages = Record<string, unknown>

const messagesFor = (lang: Lang): Messages => (lang === 'es' ? es : en)

/** Dotted-path resolver: get(obj, 'nav.pipelineCrm.label') -> string | undefined. */
const get = (obj: Messages, path: string): string | undefined => {
  const val = path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key]
    }
    return undefined
  }, obj)
  return typeof val === 'string' ? val : undefined
}

/** Same as `get`, but throws if the key does not resolve — used for required fields. */
const resolveRequired = (messages: Messages, path: string, lang: Lang): string => {
  const val = get(messages, path)
  if (!val) {
    throw new Error(`[seed-navigation] missing "${lang}" translation for key "${path}"`)
  }
  return val
}

/**
 * Maps a single NavLink (one level of nesting, per Navigation.ts's
 * one-level-deep `children` field) to the Global's nav-item shape.
 * href/status/icon/order are copied verbatim across locales.
 */
const mapItem = (item: NavLink, messages: Messages, lang: Lang): Record<string, unknown> => ({
  label: resolveRequired(messages, item.labelKey, lang),
  href: item.href,
  status: item.status,
  icon: item.icon,
  description: item.descriptionKey ? get(messages, item.descriptionKey) : undefined,
  children: item.children ? item.children.map((child) => mapItem(child, messages, lang)) : undefined,
})

/** Builds the full Global payload for one locale from nav-links.ts + messages. */
const buildGlobalData = (lang: Lang) => {
  const messages = messagesFor(lang)

  return {
    megaMenus: navMenus.map((menu) => ({
      triggerLabel: resolveRequired(messages, menu.triggerLabelKey, lang),
      columns: menu.columns.map((column) => ({
        columnLabel: column.labelKey ? get(messages, column.labelKey) : undefined,
        items: column.items.map((item) => mapItem(item, messages, lang)),
      })),
    })),
    directLinks: navDirectLinks.map((item) => mapItem(item, messages, lang)),
    // footerColumns is reference-composed at build time in nav-links.ts; the
    // seed materializes it as explicit rows in the Global (admin edits the
    // footer independently after cutover).
    footerColumns: sourceFooterColumns.map((column) => ({
      heading: resolveRequired(messages, column.headingKey, lang),
      items: column.items.map((item) => mapItem(item, messages, lang)),
      subgroupHeading: column.subgroup
        ? get(messages, column.subgroup.headingKey)
        : undefined,
      subgroupItems: column.subgroup
        ? column.subgroup.items.map((item) => mapItem(item, messages, lang))
        : undefined,
    })),
  }
}

type ArrayRow = { id?: unknown; children?: ArrayRow[] }

/**
 * Same shape as `mapItem`, but threads the `id` of the matching row from a
 * PRIOR write's returned doc — required so a second locale write UPDATES the
 * existing array rows instead of creating a parallel set. Payload treats an
 * array-field write with no `id` on a row as a brand-new row (Payload array
 * localization pitfall): writing ES without EN's row ids orphans the EN text
 * on now-unreferenced rows, which is exactly what produced the "57 empty
 * labels" readback failure on the first seed run.
 */
const mapItemWithId = (
  item: NavLink,
  priorRow: ArrayRow | undefined,
  messages: Messages,
  lang: Lang,
): Record<string, unknown> => ({
  id: priorRow?.id,
  label: resolveRequired(messages, item.labelKey, lang),
  href: item.href,
  status: item.status,
  icon: item.icon,
  description: item.descriptionKey ? get(messages, item.descriptionKey) : undefined,
  children: item.children
    ? item.children.map((child, i) => mapItemWithId(child, priorRow?.children?.[i], messages, lang))
    : undefined,
})

type EnResultDoc = {
  megaMenus?: Array<{ id?: unknown; columns?: Array<{ id?: unknown; items?: ArrayRow[] }> }>
  directLinks?: ArrayRow[]
  footerColumns?: Array<{ id?: unknown; items?: ArrayRow[]; subgroupItems?: ArrayRow[] }>
}

/**
 * Builds a locale's Global payload REUSING the array-row ids from a prior
 * write's returned doc (see `mapItemWithId`), so this write updates existing
 * rows rather than creating orphaned duplicates.
 */
const buildGlobalDataWithIds = (lang: Lang, priorResult: EnResultDoc) => {
  const messages = messagesFor(lang)

  return {
    megaMenus: navMenus.map((menu, mi) => {
      const priorMenu = priorResult.megaMenus?.[mi]
      return {
        id: priorMenu?.id,
        triggerLabel: resolveRequired(messages, menu.triggerLabelKey, lang),
        columns: menu.columns.map((column, ci) => {
          const priorColumn = priorMenu?.columns?.[ci]
          return {
            id: priorColumn?.id,
            columnLabel: column.labelKey ? get(messages, column.labelKey) : undefined,
            items: column.items.map((item, ii) =>
              mapItemWithId(item, priorColumn?.items?.[ii], messages, lang),
            ),
          }
        }),
      }
    }),
    directLinks: navDirectLinks.map((item, ii) =>
      mapItemWithId(item, priorResult.directLinks?.[ii], messages, lang),
    ),
    footerColumns: sourceFooterColumns.map((column, fi) => {
      const priorFooter = priorResult.footerColumns?.[fi]
      return {
        id: priorFooter?.id,
        heading: resolveRequired(messages, column.headingKey, lang),
        items: column.items.map((item, ii) =>
          mapItemWithId(item, priorFooter?.items?.[ii], messages, lang),
        ),
        subgroupHeading: column.subgroup
          ? get(messages, column.subgroup.headingKey)
          : undefined,
        subgroupItems: column.subgroup
          ? column.subgroup.items.map((item, ii) =>
              mapItemWithId(item, priorFooter?.subgroupItems?.[ii], messages, lang),
            )
          : undefined,
      }
    }),
  }
}

type ReadbackDoc = {
  megaMenus?: unknown[]
  directLinks?: unknown[]
  footerColumns?: unknown[]
}

/** Recursively collects every label in the nav-item tree (arbitrary depth, though schema is one level deep). */
const collectLabels = (items: unknown, acc: string[] = []): string[] => {
  if (!Array.isArray(items)) return acc
  for (const raw of items) {
    if (!raw || typeof raw !== 'object') continue
    const item = raw as { label?: unknown; children?: unknown }
    acc.push(typeof item.label === 'string' ? item.label : '')
    if (item.children) collectLabels(item.children, acc)
  }
  return acc
}

/**
 * WR-07: recursively counts every item in a source NavLink tree (each item
 * plus its children), so nested `columns`/`items`/`children`/`subgroupItems`
 * cardinality can be verified against the readback doc, not just top-level
 * array lengths. Mirrors `countReadbackItems` below.
 */
const countNavLinks = (items: NavLink[] | undefined): number => {
  if (!items) return 0
  return items.reduce((sum, item) => sum + 1 + countNavLinks(item.children), 0)
}

/** Same recursive count as `countNavLinks`, but over a readback doc's untyped item tree. */
const countReadbackItems = (items: unknown): number => {
  if (!Array.isArray(items)) return 0
  return items.reduce((sum: number, raw) => {
    if (!raw || typeof raw !== 'object') return sum
    const item = raw as { children?: unknown }
    return sum + 1 + countReadbackItems(item.children)
  }, 0)
}

/**
 * Self-verification gate (NAVCMS-07 zero-regression readback assertion):
 * asserts megaMenus/directLinks/footerColumns top-level counts AND nested
 * item counts (recursively through columns/items/children/subgroupItems)
 * match the source registry structure, and that no item has an empty label,
 * for one locale's readback doc. The nested counts close the gap the
 * top-level-only check had: a row orphaned by an id-reuse mismatch at a
 * nested level could previously read back a non-empty EN-fallback label
 * (via `localization.fallback: true`) and pass, without actually
 * representing correct ES-localized content — because nested cardinality
 * was never confirmed.
 */
const assertReadback = (
  lang: Lang,
  doc: ReadbackDoc,
  expected: {
    megaMenus: number
    directLinks: number
    footerColumns: number
    megaMenuItems: number
    directLinkItems: number
    footerItems: number
  },
): string[] => {
  const errors: string[] = []

  const megaMenusLen = doc.megaMenus?.length ?? 0
  const directLinksLen = doc.directLinks?.length ?? 0
  const footerColumnsLen = doc.footerColumns?.length ?? 0

  if (megaMenusLen !== expected.megaMenus) {
    errors.push(`[${lang}] megaMenus length ${megaMenusLen} !== expected ${expected.megaMenus}`)
  }
  if (directLinksLen !== expected.directLinks) {
    errors.push(`[${lang}] directLinks length ${directLinksLen} !== expected ${expected.directLinks}`)
  }
  if (footerColumnsLen !== expected.footerColumns) {
    errors.push(
      `[${lang}] footerColumns length ${footerColumnsLen} !== expected ${expected.footerColumns}`,
    )
  }

  const megaMenuItemsLen = (Array.isArray(doc.megaMenus) ? doc.megaMenus : []).reduce(
    (sum: number, raw) => {
      if (!raw || typeof raw !== 'object') return sum
      const menu = raw as { columns?: unknown }
      if (!Array.isArray(menu.columns)) return sum
      return (
        sum +
        menu.columns.reduce((s: number, col) => {
          if (!col || typeof col !== 'object') return s
          const column = col as { items?: unknown }
          return s + countReadbackItems(column.items)
        }, 0)
      )
    },
    0,
  )
  if (megaMenuItemsLen !== expected.megaMenuItems) {
    errors.push(
      `[${lang}] recursive megaMenus item count ${megaMenuItemsLen} !== expected ${expected.megaMenuItems} (nested columns/items/children mismatch)`,
    )
  }

  const directLinkItemsLen = countReadbackItems(doc.directLinks)
  if (directLinkItemsLen !== expected.directLinkItems) {
    errors.push(
      `[${lang}] recursive directLinks item count ${directLinkItemsLen} !== expected ${expected.directLinkItems} (nested children mismatch)`,
    )
  }

  const footerItemsLen = (Array.isArray(doc.footerColumns) ? doc.footerColumns : []).reduce(
    (sum: number, raw) => {
      if (!raw || typeof raw !== 'object') return sum
      const column = raw as { items?: unknown; subgroupItems?: unknown }
      return sum + countReadbackItems(column.items) + countReadbackItems(column.subgroupItems)
    },
    0,
  )
  if (footerItemsLen !== expected.footerItems) {
    errors.push(
      `[${lang}] recursive footerColumns item count ${footerItemsLen} !== expected ${expected.footerItems} (nested items/subgroupItems/children mismatch)`,
    )
  }

  const allLabels = [
    ...collectMegaMenuLabels(doc.megaMenus),
    ...collectLabels(doc.directLinks),
    ...collectFooterColumnLabels(doc.footerColumns),
  ]
  const emptyCount = allLabels.filter((label) => !label).length
  if (emptyCount > 0) {
    errors.push(`[${lang}] found ${emptyCount} empty label(s) among ${allLabels.length} items`)
  }

  return errors
}

const collectMegaMenuLabels = (megaMenus: unknown): string[] => {
  const labels: string[] = []
  if (!Array.isArray(megaMenus)) return labels
  for (const raw of megaMenus) {
    if (!raw || typeof raw !== 'object') continue
    const menu = raw as { triggerLabel?: unknown; columns?: unknown }
    labels.push(typeof menu.triggerLabel === 'string' ? menu.triggerLabel : '')
    if (Array.isArray(menu.columns)) {
      for (const col of menu.columns) {
        if (!col || typeof col !== 'object') continue
        const column = col as { items?: unknown }
        collectLabels(column.items, labels)
      }
    }
  }
  return labels
}

const collectFooterColumnLabels = (footerCols: unknown): string[] => {
  const labels: string[] = []
  if (!Array.isArray(footerCols)) return labels
  for (const raw of footerCols) {
    if (!raw || typeof raw !== 'object') continue
    const column = raw as { heading?: unknown; items?: unknown; subgroupItems?: unknown }
    labels.push(typeof column.heading === 'string' ? column.heading : '')
    collectLabels(column.items, labels)
    collectLabels(column.subgroupItems, labels)
  }
  return labels
}

const seedNavigation = async (): Promise<void> => {
  const payload = await getPayload({ config })

  // CR-02 idempotency guard: this script is a ONE-OFF seed but remains
  // committed and re-runnable per its own doc comment. Once an admin has
  // edited navigation through the CMS, an accidental re-run (e.g. a CI/deploy
  // step, or someone following the "Run with" comment literally) would
  // silently clobber every admin edit with the original static snapshot.
  // Mirror the "already recorded" short-circuit used by the sibling
  // reconcile-*.ts scripts: refuse to write if the Global already has
  // content, unless explicitly overridden.
  //
  // WR-09: the original guard only inspected `megaMenus.length` on the `en`
  // locale. An admin who deliberately empties every mega menu while leaving
  // `directLinks`/`footerColumns` (or the `es` locale) populated would have
  // that content silently clobbered, since the guard's precondition would
  // never trigger. Check all three top-level arrays across both locales.
  const hasContent = (
    doc:
      | { megaMenus?: unknown[] | null; directLinks?: unknown[] | null; footerColumns?: unknown[] | null }
      | null
      | undefined,
  ): boolean =>
    (doc?.megaMenus?.length ?? 0) > 0 ||
    (doc?.directLinks?.length ?? 0) > 0 ||
    (doc?.footerColumns?.length ?? 0) > 0

  const [existingEn, existingEs] = await Promise.all([
    payload.findGlobal({ slug: 'navigation', locale: 'en', depth: 0 }),
    payload.findGlobal({ slug: 'navigation', locale: 'es', depth: 0 }),
  ])
  if ((hasContent(existingEn) || hasContent(existingEs)) && !process.env.FORCE_SEED_NAVIGATION) {
    payload.logger.warn(
      '[seed-navigation] Navigation Global already has content (en or es) — refusing to overwrite. Set FORCE_SEED_NAVIGATION=1 to override.',
    )
    process.exit(1)
  }

  const enData = buildGlobalData('en')

  // EN first — establishes structure/order/non-localized fields (href/status/icon)
  // and (critically) the array-row ids every later write must reuse.
  const enResult = (await payload.updateGlobal({
    slug: 'navigation',
    locale: 'en',
    data: enData as never,
  })) as EnResultDoc
  payload.logger.info('[seed-navigation] wrote EN navigation data')

  // ES second — reuses EN's row ids (buildGlobalDataWithIds) so this UPDATES
  // the existing rows' localized fields instead of creating a parallel set
  // that leaves the EN rows' text orphaned (see mapItemWithId doc comment).
  const esData = buildGlobalDataWithIds('es', enResult)
  await payload.updateGlobal({
    slug: 'navigation',
    locale: 'es',
    data: esData as never,
  })
  payload.logger.info('[seed-navigation] wrote ES navigation data')

  const expected = {
    megaMenus: navMenus.length,
    directLinks: navDirectLinks.length,
    footerColumns: sourceFooterColumns.length,
    // WR-07: recursive nested counts, computed from the same source-of-truth
    // registry the top-level counts already use.
    megaMenuItems: navMenus.reduce(
      (sum, menu) => sum + menu.columns.reduce((s, column) => s + countNavLinks(column.items), 0),
      0,
    ),
    directLinkItems: countNavLinks(navDirectLinks),
    footerItems: sourceFooterColumns.reduce(
      (sum, column) =>
        sum + countNavLinks(column.items) + (column.subgroup ? countNavLinks(column.subgroup.items) : 0),
      0,
    ),
  }

  const [enReadback, esReadback] = await Promise.all([
    payload.findGlobal({ slug: 'navigation', locale: 'en' }),
    payload.findGlobal({ slug: 'navigation', locale: 'es' }),
  ])

  const errors = [
    ...assertReadback('en', enReadback as ReadbackDoc, expected),
    ...assertReadback('es', esReadback as ReadbackDoc, expected),
  ]

  if (errors.length > 0) {
    payload.logger.error(`[seed-navigation] READBACK VERIFICATION FAILED:\n${errors.join('\n')}`)
    process.exit(1)
  }

  payload.logger.info(
    `[seed-navigation] readback verified OK — megaMenus=${expected.megaMenus} directLinks=${expected.directLinks} footerColumns=${expected.footerColumns} (both locales, no empty labels)`,
  )
}

await seedNavigation()

if (typeof process !== 'undefined') {
  process.exit(0)
}
