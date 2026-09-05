import { Home, NotebookPen, History, CalendarDays, ChartNoAxesCombined, Settings } from 'lucide-react'
import type { NavItem } from '@/types/navigation'

export const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Today', path: '/', icon: Home },
  { id: 'log', label: 'Log', path: '/log', icon: NotebookPen },
  { id: 'history', label: 'History', path: '/history', icon: History },
  { id: 'calendar', label: 'Calendar', path: '/calendar', icon: CalendarDays },
  { id: 'insights', label: 'Insights', path: '/insights', icon: ChartNoAxesCombined },
  { id: 'settings', label: 'Settings', path: '/settings', icon: Settings },
]

/** Bottom nav on mobile only shows the items people reach for constantly. */
export const MOBILE_NAV_ITEMS: NavItem[] = NAV_ITEMS.filter((item) =>
  ['dashboard', 'log', 'history', 'insights', 'settings'].includes(item.id),
)
