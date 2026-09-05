import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { clsx } from '@/utils/clsx'

type Variant = 'clay' | 'lavender' | 'quiet' | 'ghost'
type Size = 'lg' | 'md' | 'sm'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  icon?: ReactNode
  fullWidth?: boolean
}

const VARIANT_CLASSES: Record<Variant, string> = {
  // The two primary logging actions get warm, saturated pill buttons —
  // these are meant to be the most visually prominent thing on the dashboard.
  clay: 'bg-clay text-on-accent hover:brightness-90 active:scale-[0.98] shadow-[0_6px_16px_-6px_rgba(190,90,46,0.4)]',
  lavender: 'bg-lavender text-on-accent hover:brightness-90 active:scale-[0.98] shadow-[0_6px_16px_-6px_rgba(135,131,190,0.4)]',
  // Quiet: for secondary confirms, bordered rather than filled
  quiet: 'bg-transparent text-ink border border-line-strong hover:border-ink-soft active:scale-[0.98]',
  // Ghost: text-only, for tertiary/inline actions
  ghost: 'bg-transparent text-ink-soft hover:text-ink',
}

const SIZE_CLASSES: Record<Size, string> = {
  lg: 'px-7 py-4 text-base gap-3',
  md: 'px-5 py-3 text-sm gap-2',
  sm: 'px-3.5 py-2 text-sm gap-1.5',
}

export function Button({
  variant = 'quiet',
  size = 'md',
  icon,
  fullWidth,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center rounded-[var(--radius-pill)] font-semibold transition-all duration-150 disabled:opacity-40 disabled:pointer-events-none',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        fullWidth && 'w-full',
        className,
      )}
      {...rest}
    >
      {icon}
      {children}
    </button>
  )
}
