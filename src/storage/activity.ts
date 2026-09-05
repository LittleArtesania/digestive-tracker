import type { DigestiveEntry } from '@/types/tracker'
import { getAllBowelMovements, deleteBowelMovement } from './bowelMovements'
import { getAllGasEvents, deleteGasEvent } from './gasEvents'

function mergeAndSort(): DigestiveEntry[] {
  const bowelMovements: DigestiveEntry[] = getAllBowelMovements().map((data) => ({ kind: 'bowel-movement', data }))
  const gasEvents: DigestiveEntry[] = getAllGasEvents().map((data) => ({ kind: 'gas-event', data }))
  return [...bowelMovements, ...gasEvents].sort((a, b) => b.data.timestamp.localeCompare(a.data.timestamp))
}

/** Most recent entries across both bowel movements and gas events, newest first. */
export function getRecentActivity(limit = 8): DigestiveEntry[] {
  return mergeAndSort().slice(0, limit)
}

/** Every logged entry across both stores, newest first — used by the History page. */
export function getAllEntries(): DigestiveEntry[] {
  return mergeAndSort()
}

/** All entries (both kinds) for a single local calendar day, newest first. */
export function getEntriesForDate(date: Date): DigestiveEntry[] {
  const target = date.toDateString()
  return mergeAndSort().filter((entry) => new Date(entry.data.timestamp).toDateString() === target)
}

/** Deletes an entry regardless of which store it lives in. */
export function deleteEntry(entry: DigestiveEntry): boolean {
  return entry.kind === 'bowel-movement' ? deleteBowelMovement(entry.data.id) : deleteGasEvent(entry.data.id)
}
