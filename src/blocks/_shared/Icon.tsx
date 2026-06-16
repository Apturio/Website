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
  type LucideProps,
} from 'lucide-react'
import type { ComponentType } from 'react'

/**
 * Maps the design's lucide icon names (as authored in the prototype HTML and
 * stored in Payload block fields) to their lucide-react components. Keys accept
 * either the kebab-case design name (e.g. "calendar-check") or PascalCase.
 */
const ICONS: Record<string, ComponentType<LucideProps>> = {
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

/** Render a lucide icon by its design name. Falls back to a check icon. */
export function Icon({ name, ...props }: { name?: string | null } & LucideProps) {
  const Cmp = (name && ICONS[name]) || Check
  return <Cmp {...props} />
}
