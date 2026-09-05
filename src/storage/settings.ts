import type { AppSettings } from '@/types/tracker'
import { STORAGE_KEYS } from '@/constants/storageKeys'
import { readFromStorage, writeToStorage } from './localStorageClient'

export const DEFAULT_SETTINGS: AppSettings = {
  dateFormat: 'mdy',
  timeFormat: '12h',
  firstDayOfWeek: 0,
  privateMode: false,
  theme: 'system',
  hasCompletedOnboarding: false,
}

export function getSettings(): AppSettings {
  // Merge over defaults so a future new setting doesn't come back as `undefined`
  // for people who saved settings before that field existed.
  return { ...DEFAULT_SETTINGS, ...readFromStorage<Partial<AppSettings>>(STORAGE_KEYS.settings, {}) }
}

export function updateSettings(patch: Partial<AppSettings>): AppSettings {
  const updated = { ...getSettings(), ...patch }
  writeToStorage(STORAGE_KEYS.settings, updated)
  return updated
}
