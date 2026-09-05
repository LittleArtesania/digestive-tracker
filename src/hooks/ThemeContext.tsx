import { createContext, useContext, useState, type ReactNode } from 'react'
import type { ThemePreference } from '@/types/tracker'
import { getSettings } from '@/storage/settings'
import { useAppliedTheme } from './useAppliedTheme'

interface ThemeContextValue {
  themePreference: ThemePreference
  setThemePreference: (preference: ThemePreference) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themePreference, setThemePreference] = useState<ThemePreference>(() => getSettings().theme)
  useAppliedTheme(themePreference)

  return <ThemeContext.Provider value={{ themePreference, setThemePreference }}>{children}</ThemeContext.Provider>
}

/** Lets any component (namely Settings) change the applied theme immediately, in sync with saved settings. */
export function useThemeContext(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useThemeContext must be used within a ThemeProvider')
  return context
}
