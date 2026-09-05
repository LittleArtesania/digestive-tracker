import { NavLink } from 'react-router-dom'
import { MOBILE_NAV_ITEMS } from '@/constants/navigation'
import { clsx } from '@/utils/clsx'

export function BottomNav() {
  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-surface/90 backdrop-blur border-t border-line pb-[env(safe-area-inset-bottom)]"
      aria-label="Main navigation"
    >
      <ul className="flex items-stretch justify-between px-1">
        {MOBILE_NAV_ITEMS.map(({ id, label, path, icon: Icon }) => (
          <li key={id} className="flex-1">
            <NavLink
              to={path}
              end={path === '/'}
              className={({ isActive }) =>
                clsx(
                  'flex flex-col items-center justify-center gap-1 py-2.5 min-h-[56px] text-[11px] font-medium transition-colors',
                  isActive ? 'text-clay-text' : 'text-ink-soft',
                )
              }
            >
              <Icon size={20} strokeWidth={2} aria-hidden="true" />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
