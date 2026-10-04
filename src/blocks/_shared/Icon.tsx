import { Check } from 'lucide-react'
import type { LucideProps } from 'lucide-react'

import { LazyIcon } from './LazyIcon'
import { PUBLIC_ICONS } from './icon-set'

/**
 * Render a lucide icon by its kebab-case design name (e.g. "calendar-check").
 * Known icons come from the tree-shaken PUBLIC_ICONS map; any other valid lucide name is
 * loaded on demand (LazyIcon). Falls back to a check icon when the name is empty.
 */
export function Icon({ name, ...props }: { name?: string | null } & LucideProps) {
  if (!name) return <Check {...props} />
  const Known = PUBLIC_ICONS[name]
  if (Known) return <Known {...props} />
  return <LazyIcon name={name} {...props} />
}
