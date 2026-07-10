import * as icons from 'lucide-react'
import type { LucideProps } from 'lucide-react'
import type { ComponentType } from 'react'

/**
 * Static icon data source for the Icon Picker field. Derives the full
 * lucide-react export set into kebab-case names (matching the naming
 * convention already stored in block fields today, e.g. "calendar-check"),
 * filters out alias/duplicate exports, and exposes a name->component lookup.
 *
 * Pure data/transform module: no 'use client' directive, no JSX. Safe to
 * import from both the client picker component and server code.
 */

export type IconEntry = {
  name: string
  pascal: string
  Component: ComponentType<LucideProps>
}

/**
 * Converts a PascalCase lucide-react export name to its kebab-case
 * equivalent, giving numeric suffixes their own hyphen segment.
 *
 * Examples: 'BarChart3' -> 'bar-chart-3', 'CalendarCheck' -> 'calendar-check',
 * 'GitMerge' -> 'git-merge', 'Zap' -> 'zap'.
 */
export function toKebabName(pascal: string): string {
  return pascal
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([a-zA-Z])([0-9])/g, '$1-$2')
    .toLowerCase()
}

const PASCAL_EXPORT_RE = /^[A-Z][A-Za-z0-9]*$/
const EXCLUDED_EXPORTS = new Set(['createLucideIcon', 'icons', 'default'])

function isRenderableComponent(value: unknown): value is ComponentType<LucideProps> {
  return typeof value === 'object' || typeof value === 'function'
}

function deriveIconList(): IconEntry[] {
  const entries: IconEntry[] = []

  for (const [pascal, value] of Object.entries(icons)) {
    if (!PASCAL_EXPORT_RE.test(pascal)) continue
    if (EXCLUDED_EXPORTS.has(pascal)) continue
    if (pascal.endsWith('Icon')) continue
    if (pascal.startsWith('Lucide')) continue
    if (!isRenderableComponent(value)) continue

    entries.push({
      name: toKebabName(pascal),
      pascal,
      Component: value as ComponentType<LucideProps>,
    })
  }

  entries.sort((a, b) => a.name.localeCompare(b.name))
  return entries
}

/** Full, alias-filtered, kebab-named lucide-react icon list, sorted by name. */
export const iconList: IconEntry[] = deriveIconList()

const ICON_LOOKUP: Map<string, ComponentType<LucideProps>> = new Map(
  iconList.map((entry) => [entry.name, entry.Component]),
)

/**
 * Resolves an icon component by its kebab-case name. Returns undefined on a
 * miss — callers own their own fallback (e.g. the Icon.tsx renderer in
 * Phase 18 falls back to Check).
 */
export function getIcon(name: string): ComponentType<LucideProps> | undefined {
  return ICON_LOOKUP.get(name)
}
