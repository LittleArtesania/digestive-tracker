import type { ReactNode } from 'react'

interface SettingsRowProps {
  label: string
  description?: string
  children: ReactNode
  /** When set, the label renders as a real <label htmlFor> tied to the control's id. */
  htmlFor?: string
}

export function SettingsRow({ label, description, children, htmlFor }: SettingsRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="min-w-0">
        {htmlFor ? (
          <label htmlFor={htmlFor} className="text-sm font-medium">
            {label}
          </label>
        ) : (
          <p className="text-sm font-medium">{label}</p>
        )}
        {description && <p className="text-xs text-ink-soft mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  )
}
