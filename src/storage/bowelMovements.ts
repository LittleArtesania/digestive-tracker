import type { BowelMovement } from '@/types/tracker'
import { STORAGE_KEYS } from '@/constants/storageKeys'
import { readFromStorage, writeToStorage } from './localStorageClient'
import { generateId } from '@/utils/id'

type NewBowelMovement = Omit<BowelMovement, 'id' | 'createdAt' | 'updatedAt'>
type BowelMovementPatch = Partial<NewBowelMovement>

function readAll(): BowelMovement[] {
  return readFromStorage<BowelMovement[]>(STORAGE_KEYS.bowelMovements, [])
}

function writeAll(entries: BowelMovement[]): boolean {
  return writeToStorage(STORAGE_KEYS.bowelMovements, entries)
}

export function getAllBowelMovements(): BowelMovement[] {
  // Newest first — this is the order every list/timeline view wants.
  return [...readAll()].sort((a, b) => b.timestamp.localeCompare(a.timestamp))
}

export function getBowelMovementById(id: string): BowelMovement | null {
  return readAll().find((entry) => entry.id === id) ?? null
}

export function addBowelMovement(input: NewBowelMovement): BowelMovement {
  const now = new Date().toISOString()
  const entry: BowelMovement = {
    ...input,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  }
  writeAll([...readAll(), entry])
  return entry
}

export function updateBowelMovement(id: string, patch: BowelMovementPatch): BowelMovement | null {
  const all = readAll()
  const index = all.findIndex((entry) => entry.id === id)
  if (index === -1) return null

  const updated: BowelMovement = {
    ...all[index],
    ...patch,
    updatedAt: new Date().toISOString(),
  }
  all[index] = updated
  writeAll(all)
  return updated
}

export function deleteBowelMovement(id: string): boolean {
  const all = readAll()
  const filtered = all.filter((entry) => entry.id !== id)
  if (filtered.length === all.length) return false
  return writeAll(filtered)
}

/** All bowel movements whose timestamp falls on the given local calendar day. */
export function getBowelMovementsForDate(date: Date): BowelMovement[] {
  const target = date.toDateString()
  return getAllBowelMovements().filter((entry) => new Date(entry.timestamp).toDateString() === target)
}
