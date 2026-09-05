import type { HTMLAttributes } from 'react'
import { clsx } from '@/utils/clsx'

type Variant = 'hero' | 'flat' | 'tinted'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: Variant
}

const VARIANT_CLASSES: Record<Variant, string> = {
  // Reserved for the single most important card on a screen (today's summary).
  hero: 'bg-surface rounded-[var(--radius-card)] shadow-[0_20px_40px_-24px_rgba(44,38,32,0.25)] border border-line/60',
  // The default for everyday repeated content — a hairline border, no shadow,
  // so it doesn't compete with the hero card.
  flat: 'bg-surface/60 rounded-[var(--radius-card)] border border-line',
  // For a soft colored panel (e.g. a tip, an empty state)
  tinted: 'bg-clay-dim rounded-[var(--radius-card)] border border-clay-soft/60',
}

export function Card({ variant = 'flat', className, children, ...rest }: CardProps) {
  return (
    <div className={clsx(VARIANT_CLASSES[variant], 'p-5', className)} {...rest}>
      {children}
    </div>
  )
}
