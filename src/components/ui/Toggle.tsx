import { clsx } from '@/utils/clsx'

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
}

export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={clsx(
        'relative inline-flex h-7 w-12 items-center rounded-[var(--radius-pill)] transition-colors shrink-0',
        checked ? 'bg-clay' : 'bg-line',
      )}
    >
      <span
        className={clsx(
          'inline-block h-5 w-5 transform rounded-full bg-surface transition-transform shadow-sm',
          checked ? 'translate-x-6' : 'translate-x-1',
        )}
      />
    </button>
  )
}
