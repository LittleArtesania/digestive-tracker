import type { GasEvent } from '@/types/tracker'
import { STORAGE_KEYS } from '@/constants/storageKeys'
import { readFromStorage, writeToStorage } from './localStorageClient'
import { generateId } from '@/utils/id'

type NewGasEvent = Omit<GasEvent, 'id' | 'createdAt' | 'updatedAt'>
type GasEventPatch = Partial<NewGasEvent>

function readAll(): GasEvent[] {
  return readFromStorage<GasEvent[]>(STORAGE_KEYS.gasEvents, [])
}

function writeAll(entries: GasEvent[]): boolean {
  return writeToStorage(STORAGE_KEYS.gasEvents, entries)
}

export function getAllGasEvents(): GasEvent[] {
  return [...readAll()].sort((a, b) => b.timestamp.localeCompare(a.timestamp))
}

export function getGasEventById(id: string): GasEvent | null {
  return readAll().find((entry) => entry.id === id) ?? null
}

export function addGasEvent(input: NewGasEvent): GasEvent {
  const now = new Date().toISOString()
  const entry: GasEvent = {
    ...input,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  }
  writeAll([...readAll(), entry])
  return entry
}

export function updateGasEvent(id: string, patch: GasEventPatch): GasEvent | null {
  const all = readAll()
  const index = all.findIndex((entry) => entry.id === id)
  if (index === -1) return null

  const updated: GasEvent = {
    ...all[index],
    ...patch,
    updatedAt: new Date().toISOString(),
  }
  all[index] = updated
  writeAll(all)
  return updated
}

export function deleteGasEvent(id: string): boolean {
  const all = readAll()
  const filtered = all.filter((entry) => entry.id !== id)
  if (filtered.length === all.length) return false
  return writeAll(filtered)
}

export function getGasEventsForDate(date: Date): GasEvent[] {
  const target = date.toDateString()
  return getAllGasEvents().filter((entry) => new Date(entry.timestamp).toDateString() === target)
}
