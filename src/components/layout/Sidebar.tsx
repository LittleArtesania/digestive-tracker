import { NavLink } from 'react-router-dom'
import { NAV_ITEMS } from '@/constants/navigation'
import { clsx } from '@/utils/clsx'

export function Sidebar() {
  return (
    <aside className="hidden md:flex md:w-60 md:flex-col md:shrink-0 border-r border-line bg-paper-dim/50 px-4 py-6">
      <div className="px-2 mb-8">
        <p className="font-display text-2xl leading-none">
          Well<span className="text-clay-text">ness</span>
        </p>
        <p className="text-xs text-ink-soft mt-1">Your private journal</p>
      </div>

      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ id, label, path, icon: Icon }) => (
          <NavLink
            key={id}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-chip)] text-sm font-medium transition-colors',
                isActive ? 'bg-clay-dim text-clay-text' : 'text-ink-soft hover:bg-paper-dim hover:text-ink',
              )
            }
          >
            <Icon size={18} strokeWidth={2} aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>

      <p className="mt-auto px-2 text-xs text-ink-soft leading-relaxed">
        Your data stays on this device.
      </p>
    </aside>
  )
}
