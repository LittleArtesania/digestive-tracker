import { useEffect } from 'react'
import type { ThemePreference } from '@/types/tracker'

function resolveTheme(preference: ThemePreference): 'light' | 'dark' {
  if (preference === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return preference
}

/** Applies `data-theme` to <html> based on the given preference, and keeps it in sync with system changes. */
export function useAppliedTheme(preference: ThemePreference) {
  useEffect(() => {
    function apply() {
      document.documentElement.dataset.theme = resolveTheme(preference)
    }
    apply()

    if (preference !== 'system') return
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', apply)
    return () => mediaQuery.removeEventListener('change', apply)
  }, [preference])
}
