import { useEffect } from 'react'
import { clsx } from '@/utils/clsx'

interface ToastProps {
  message: string
  onDismiss: () => void
  durationMs?: number
}

export function Toast({ message, onDismiss, durationMs = 2000 }: ToastProps) {
  useEffect(() => {
    const id = setTimeout(onDismiss, durationMs)
    return () => clearTimeout(id)
  }, [onDismiss, durationMs])

  return (
    <div
      role="status"
      className={clsx(
        'fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-50',
        'bg-clay text-on-accent text-sm font-semibold px-5 py-3 rounded-[var(--radius-pill)]',
        'shadow-[0_12px_24px_-8px_rgba(0,0,0,0.35)] animate-[toast-in_0.18s_ease-out]',
      )}
    >
      {message}
    </div>
  )
}
