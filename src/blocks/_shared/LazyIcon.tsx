'use client'

import dynamic from 'next/dynamic'
import { Check } from 'lucide-react'
import type { LucideProps } from 'lucide-react'
import dynamicIconImports from 'lucide-react/dynamicIconImports'
import type { ComponentType } from 'react'

const cache = new Map<string, ComponentType<LucideProps>>()

/** Loads a single lucide icon chunk on demand (icons that are not in PUBLIC_ICONS). */
export function LazyIcon({ name, ...props }: { name: string } & LucideProps) {
  const load = (dynamicIconImports as Record<string, () => Promise<{ default: ComponentType<LucideProps> }>>)[name]
  if (!load) return <Check {...props} />
  let Cmp = cache.get(name)
  if (!Cmp) {
    Cmp = dynamic(load) as ComponentType<LucideProps>
    cache.set(name, Cmp)
  }
  return <Cmp {...props} />
}
