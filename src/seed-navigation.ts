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
 * Self-verification gate (NAVCMS-07 zero-regression readback assertion):
 * asserts megaMenus/directLinks/footerColumns counts match the source arrays
 * and that no item has an empty label, for one locale's readback doc.
 */
const assertReadback = (
  lang: Lang,
  doc: ReadbackDoc,
  expected: { megaMenus: number; directLinks: number; footerColumns: number },
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
  const existing = await payload.findGlobal({ slug: 'navigation', locale: 'en', depth: 0 })
  if (Array.isArray(existing?.megaMenus) && existing.megaMenus.length > 0 && !process.env.FORCE_SEED_NAVIGATION) {
    payload.logger.warn(
      '[seed-navigation] Navigation Global already has content — refusing to overwrite. Set FORCE_SEED_NAVIGATION=1 to override.',
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
