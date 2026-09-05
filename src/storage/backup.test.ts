import { describe, it, expect } from 'vitest'
import { addBowelMovement, getAllBowelMovements } from './bowelMovements'
import { addGasEvent, getAllGasEvents } from './gasEvents'
import { updateSettings, getSettings, DEFAULT_SETTINGS } from './settings'
import { buildBackupPayload, importBackup, resetAllData } from './backup'

describe('backup export/import/reset', () => {
  it('builds a payload containing current data and settings', () => {
    addBowelMovement({ timestamp: new Date().toISOString(), stoolType: 4 })
    updateSettings({ theme: 'dark' })

    const payload = buildBackupPayload()
    expect(payload.version).toBe(1)
    expect(payload.bowelMovements).toHaveLength(1)
    expect(payload.settings.theme).toBe('dark')
    expect(payload.exportedAt).toBeTruthy()
  })

  it('round-trips through export -> reset -> import without losing data', () => {
    addBowelMovement({ timestamp: new Date().toISOString(), stoolType: 4, notes: 'round trip test' })
    addGasEvent({ timestamp: new Date().toISOString(), amount: 'medium', odor: 'mild', context: 'random' })
    updateSettings({ theme: 'dark', privateMode: true })

    const payload = buildBackupPayload()

    resetAllData()
    expect(getAllBowelMovements()).toHaveLength(0)
    expect(getSettings().theme).toBe(DEFAULT_SETTINGS.theme)

    const result = importBackup(JSON.stringify(payload))
    expect(result.success).toBe(true)
    expect(getAllBowelMovements()).toHaveLength(1)
    expect(getAllBowelMovements()[0].notes).toBe('round trip test')
    expect(getAllGasEvents()).toHaveLength(1)
    expect(getSettings().theme).toBe('dark')
    expect(getSettings().privateMode).toBe(true)
  })

  it('rejects invalid JSON with a friendly error, without touching existing data', () => {
    addBowelMovement({ timestamp: new Date().toISOString() })
    const result = importBackup('{not valid json')
    expect(result.success).toBe(false)
    expect(getAllBowelMovements()).toHaveLength(1) // untouched
  })

  it('rejects a well-formed JSON object that is not a valid backup shape', () => {
    const result = importBackup(JSON.stringify({ version: 1, bowelMovements: 'not-an-array' }))
    expect(result.success).toBe(false)
  })

  it('resetAllData clears bowel movements, gas events, and settings', () => {
    addBowelMovement({ timestamp: new Date().toISOString() })
    addGasEvent({ timestamp: new Date().toISOString(), amount: 'small', odor: 'none', context: 'random' })
    updateSettings({ privateMode: true })

    resetAllData()

    expect(getAllBowelMovements()).toHaveLength(0)
    expect(getAllGasEvents()).toHaveLength(0)
    expect(getSettings()).toEqual(DEFAULT_SETTINGS)
  })
})
