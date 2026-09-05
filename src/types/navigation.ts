import type { LucideIcon } from 'lucide-react'

export type AppSection = 'dashboard' | 'log' | 'history' | 'calendar' | 'insights' | 'settings'

export interface NavItem {
  id: AppSection
  label: string
  path: string
  icon: LucideIcon
}
