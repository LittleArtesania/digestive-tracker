import type { BackupPayload, BowelMovement, GasEvent } from '@/types/tracker'
import { STORAGE_KEYS } from '@/constants/storageKeys'
import { removeFromStorage, writeToStorage } from './localStorageClient'
import { getAllBowelMovements } from './bowelMovements'
import { getAllGasEvents } from './gasEvents'
import { getSettings } from './settings'

export function buildBackupPayload(): BackupPayload {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    bowelMovements: getAllBowelMovements(),
    gasEvents: getAllGasEvents(),
    settings: getSettings(),
  }
}

/** Triggers a browser download of a JSON backup file. Only usable in a browser context. */
export function downloadBackup(): void {
  const payload = buildBackupPayload()
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  const datePart = payload.exportedAt.slice(0, 10)
  link.href = url
  link.download = `digestive-tracker-backup-${datePart}.json`
  link.click()
  URL.revokeObjectURL(url)
}

export type ImportResult = { success: true } | { success: false; error: string }

/**
 * Validates and restores a previously exported backup. Deliberately defensive:
 * a hand-edited or corrupted file should produce a friendly error, never a crash.
 */
export function importBackup(rawJson: string): ImportResult {
  let parsed: unknown
  try {
    parsed = JSON.parse(rawJson)
  } catch {
    return { success: false, error: 'That file isn\'t valid JSON. Please choose an unmodified backup file.' }
  }

  if (!isBackupPayload(parsed)) {
    return { success: false, error: 'That file doesn\'t look like a digestive tracker backup.' }
  }

  writeToStorage(STORAGE_KEYS.bowelMovements, parsed.bowelMovements)
  writeToStorage(STORAGE_KEYS.gasEvents, parsed.gasEvents)
  writeToStorage(STORAGE_KEYS.settings, parsed.settings)
  return { success: true }
}

function isBackupPayload(value: unknown): value is BackupPayload {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as Record<string, unknown>
  return (
    candidate.version === 1 &&
    Array.isArray(candidate.bowelMovements) &&
    candidate.bowelMovements.every(isBowelMovementShape) &&
    Array.isArray(candidate.gasEvents) &&
    candidate.gasEvents.every(isGasEventShape) &&
    typeof candidate.settings === 'object' &&
    candidate.settings !== null
  )
}

function isBowelMovementShape(value: unknown): value is BowelMovement {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as Record<string, unknown>
  return typeof candidate.id === 'string' && typeof candidate.timestamp === 'string'
}

function isGasEventShape(value: unknown): value is GasEvent {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as Record<string, unknown>
  return typeof candidate.id === 'string' && typeof candidate.timestamp === 'string'
}

/** Permanently deletes every stored record and setting. The UI is responsible for confirming first. */
export function resetAllData(): void {
  removeFromStorage(STORAGE_KEYS.bowelMovements)
  removeFromStorage(STORAGE_KEYS.gasEvents)
  removeFromStorage(STORAGE_KEYS.settings)
}
