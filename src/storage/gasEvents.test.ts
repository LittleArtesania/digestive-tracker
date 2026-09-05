import { describe, it, expect } from 'vitest'
import { addGasEvent, getAllGasEvents, getGasEventById, updateGasEvent, deleteGasEvent, getGasEventsForDate } from './gasEvents'

function makeEntry(overrides: Partial<Parameters<typeof addGasEvent>[0]> = {}) {
  return addGasEvent({
    timestamp: new Date(2026, 0, 15, 12, 0).toISOString(),
    amount: 'medium',
    odor: 'mild',
    context: 'random',
    ...overrides,
  })
}

describe('gasEvents storage', () => {
  it('adds and persists an entry', () => {
    makeEntry()
    expect(getAllGasEvents()).toHaveLength(1)
  })

  it('finds by id and returns null for a missing one', () => {
    const entry = makeEntry()
    expect(getGasEventById(entry.id)?.amount).toBe('medium')
    expect(getGasEventById('missing')).toBeNull()
  })

  it('updates fields without touching unrelated ones', () => {
    const entry = makeEntry({ odor: 'none' })
    const updated = updateGasEvent(entry.id, { odor: 'strong' })
    expect(updated?.odor).toBe('strong')
    expect(updated?.context).toBe('random')
  })

  it('deletes an entry', () => {
    const entry = makeEntry()
    expect(deleteGasEvent(entry.id)).toBe(true)
    expect(getAllGasEvents()).toHaveLength(0)
  })

  it('filters to a single calendar day', () => {
    makeEntry({ timestamp: new Date(2026, 0, 15, 9, 0).toISOString() })
    makeEntry({ timestamp: new Date(2026, 0, 16, 9, 0).toISOString() })
    expect(getGasEventsForDate(new Date(2026, 0, 15))).toHaveLength(1)
  })
})
