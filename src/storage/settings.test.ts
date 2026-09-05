import { describe, it, expect } from 'vitest'
import { getSettings, updateSettings, DEFAULT_SETTINGS } from './settings'

describe('settings storage', () => {
  it('returns defaults when nothing has been saved', () => {
    expect(getSettings()).toEqual(DEFAULT_SETTINGS)
  })

  it('persists a partial update, merging with existing settings', () => {
    updateSettings({ theme: 'dark' })
    updateSettings({ privateMode: true })
    const settings = getSettings()
    expect(settings.theme).toBe('dark')
    expect(settings.privateMode).toBe(true)
    expect(settings.timeFormat).toBe(DEFAULT_SETTINGS.timeFormat) // untouched field preserved
  })

  it('fills in missing fields with defaults (forward compatibility)', () => {
    // Simulate an older saved settings blob missing a field a newer version added.
    window.localStorage.setItem('digestive-tracker:settings', JSON.stringify({ theme: 'dark' }))
    const settings = getSettings()
    expect(settings.theme).toBe('dark')
    expect(settings.dateFormat).toBe(DEFAULT_SETTINGS.dateFormat)
  })
})
