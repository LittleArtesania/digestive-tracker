import type { ReactNode } from 'react'

interface EmptyStateProps {
  emoji: string
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ emoji, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center text-center py-16 px-6">
      <span className="text-4xl mb-4" aria-hidden="true">
        {emoji}
      </span>
      <h2 className="font-display text-xl mb-2">{title}</h2>
      <p className="text-sm text-ink-soft max-w-xs leading-relaxed">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
