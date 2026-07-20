import assert from 'node:assert/strict'

import {
  BarChart3,
  Bot,
  CalendarCheck,
  Check,
  ChevronDown,
  ChevronRight,
  Database,
  Filter,
  Gift,
  GitMerge,
  Layers,
  PhoneCall,
  Play,
  Rocket,
  Search,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Workflow,
  Wrench,
  Zap,
} from 'lucide-react'

import { getIcon } from '../src/fields/IconPicker/icons.ts'

/**
 * Parity check: proves getIcon() from the Phase 17 icons.ts module resolves
 * the exact same lucide-react components as the old hardcoded ICONS map in
 * Icon.tsx, for all 22 originally-supported kebab names. Must run green
 * BEFORE the old map is deleted from Icon.tsx.
 */

const expected: Record<string, unknown> = {
  'bar-chart-3': BarChart3,
  bot: Bot,
  'calendar-check': CalendarCheck,
  check: Check,
  'chevron-down': ChevronDown,
  'chevron-right': ChevronRight,
  database: Database,
  filter: Filter,
  gift: Gift,
  'git-merge': GitMerge,
  layers: Layers,
  'phone-call': PhoneCall,
  play: Play,
  rocket: Rocket,
  search: Search,
  sparkles: Sparkles,
  star: Star,
  'trending-up': TrendingUp,
  users: Users,
  workflow: Workflow,
  wrench: Wrench,
  zap: Zap,
}

const keys = Object.keys(expected)

for (const key of keys) {
  const resolved = getIcon(key)
  assert.notEqual(resolved, undefined, `getIcon('${key}') should not be undefined`)
  assert.equal(
    resolved,
    expected[key],
    `getIcon('${key}') should be strictly identical to the old ICONS['${key}'] component`,
  )
}

// getIcon on an unknown name must return undefined (not throw) — the Icon.tsx
// fallback branch, not getIcon itself, is responsible for the Check fallback.
assert.equal(
  getIcon('this-icon-does-not-exist'),
  undefined,
  'getIcon should return undefined for an unknown icon name',
)

console.log(`icon parity OK: ${keys.length}/${keys.length}`)
