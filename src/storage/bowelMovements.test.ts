import { describe, it, expect } from 'vitest'
import {
  addBowelMovement,
  getAllBowelMovements,
  getBowelMovementById,
  updateBowelMovement,
  deleteBowelMovement,
  getBowelMovementsForDate,
} from './bowelMovements'

function makeEntry(overrides: Partial<Parameters<typeof addBowelMovement>[0]> = {}) {
  return addBowelMovement({
    timestamp: new Date(2026, 0, 15, 8, 0).toISOString(),
    durationSeconds: 300,
    stoolType: 4,
    ...overrides,
  })
}

describe('bowelMovements storage', () => {
  it('adds an entry and assigns it an id and timestamps', () => {
    const entry = makeEntry()
    expect(entry.id).toBeTruthy()
    expect(entry.createdAt).toBeTruthy()
    expect(entry.updatedAt).toBe(entry.createdAt)
  })

  it('persists the entry so getAllBowelMovements sees it', () => {
    makeEntry()
    expect(getAllBowelMovements()).toHaveLength(1)
  })

  it('returns entries newest-first', () => {
    makeEntry({ timestamp: new Date(2026, 0, 1).toISOString() })
    makeEntry({ timestamp: new Date(2026, 0, 20).toISOString() })
    const all = getAllBowelMovements()
    expect(new Date(all[0].timestamp).getDate()).toBe(20)
    expect(new Date(all[1].timestamp).getDate()).toBe(1)
  })

  it('finds an entry by id', () => {
    const entry = makeEntry()
    expect(getBowelMovementById(entry.id)?.id).toBe(entry.id)
  })

  it('returns null for a missing id', () => {
    expect(getBowelMovementById('does-not-exist')).toBeNull()
  })

  it('updates only the given fields and bumps updatedAt', () => {
    const entry = makeEntry({ stoolType: 3 })
    const updated = updateBowelMovement(entry.id, { stoolType: 5 })
    expect(updated?.stoolType).toBe(5)
    expect(updated?.durationSeconds).toBe(300) // untouched field preserved
    expect(updated?.createdAt).toBe(entry.createdAt) // createdAt never changes
  })

  it('returns null when updating a missing id', () => {
    expect(updateBowelMovement('nope', { stoolType: 1 })).toBeNull()
  })

  it('deletes an entry', () => {
    const entry = makeEntry()
    expect(deleteBowelMovement(entry.id)).toBe(true)
    expect(getAllBowelMovements()).toHaveLength(0)
  })

  it('returns false when deleting a missing id', () => {
    expect(deleteBowelMovement('nope')).toBe(false)
  })

  it('filters entries to a single calendar day', () => {
    makeEntry({ timestamp: new Date(2026, 0, 15, 8, 0).toISOString() })
    makeEntry({ timestamp: new Date(2026, 0, 15, 20, 0).toISOString() })
    makeEntry({ timestamp: new Date(2026, 0, 16, 8, 0).toISOString() })
    expect(getBowelMovementsForDate(new Date(2026, 0, 15))).toHaveLength(2)
    expect(getBowelMovementsForDate(new Date(2026, 0, 16))).toHaveLength(1)
    expect(getBowelMovementsForDate(new Date(2026, 0, 17))).toHaveLength(0)
  })
})
