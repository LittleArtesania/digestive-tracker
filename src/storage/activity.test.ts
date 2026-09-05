import { describe, it, expect } from 'vitest'
import { addBowelMovement } from './bowelMovements'
import { addGasEvent } from './gasEvents'
import { getAllEntries, getRecentActivity, getEntriesForDate, deleteEntry } from './activity'

describe('activity (merged bowel movements + gas events)', () => {
  it('merges both stores and sorts newest-first', () => {
    addBowelMovement({ timestamp: new Date(2026, 0, 1, 8, 0).toISOString() })
    addGasEvent({ timestamp: new Date(2026, 0, 2, 8, 0).toISOString(), amount: 'small', odor: 'none', context: 'random' })
    addBowelMovement({ timestamp: new Date(2026, 0, 3, 8, 0).toISOString() })

    const all = getAllEntries()
    expect(all).toHaveLength(3)
    expect(new Date(all[0].data.timestamp).getDate()).toBe(3)
    expect(new Date(all[2].data.timestamp).getDate()).toBe(1)
  })

  it('getRecentActivity respects the limit', () => {
    for (let i = 1; i <= 10; i++) {
      addBowelMovement({ timestamp: new Date(2026, 0, i, 8, 0).toISOString() })
    }
    expect(getRecentActivity(3)).toHaveLength(3)
    expect(getRecentActivity()).toHaveLength(8) // default limit
  })

  it('getEntriesForDate returns only that day, mixing both kinds', () => {
    addBowelMovement({ timestamp: new Date(2026, 0, 15, 8, 0).toISOString() })
    addGasEvent({ timestamp: new Date(2026, 0, 15, 14, 0).toISOString(), amount: 'small', odor: 'none', context: 'random' })
    addBowelMovement({ timestamp: new Date(2026, 0, 16, 8, 0).toISOString() })

    const entries = getEntriesForDate(new Date(2026, 0, 15))
    expect(entries).toHaveLength(2)
    expect(entries.some((e) => e.kind === 'bowel-movement')).toBe(true)
    expect(entries.some((e) => e.kind === 'gas-event')).toBe(true)
  })

  it('deleteEntry removes from the correct store without touching the other', () => {
    const bm = addBowelMovement({ timestamp: new Date().toISOString() })
    addGasEvent({ timestamp: new Date().toISOString(), amount: 'small', odor: 'none', context: 'random' })

    const bmEntry = getAllEntries().find((e) => e.kind === 'bowel-movement')!
    expect(bmEntry.data.id).toBe(bm.id)

    deleteEntry(bmEntry)
    const remaining = getAllEntries()
    expect(remaining).toHaveLength(1)
    expect(remaining[0].kind).toBe('gas-event')
  })
})
