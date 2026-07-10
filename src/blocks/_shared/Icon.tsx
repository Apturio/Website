import { Check } from 'lucide-react'
import type { LucideProps } from 'lucide-react'

import { getIcon } from '@/fields/IconPicker/icons'

/**
 * Render a lucide icon by its kebab-case design name (e.g. "calendar-check"),
 * resolved dynamically against the full lucide-react export set via getIcon.
 * Falls back to a check icon when the name is missing or doesn't resolve.
 */
export function Icon({ name, ...props }: { name?: string | null } & LucideProps) {
  const Cmp = (name && getIcon(name)) || Check
  return <Cmp {...props} />
}
