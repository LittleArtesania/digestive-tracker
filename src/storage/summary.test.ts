import { describe, it, expect, vi, afterEach } from 'vitest'
import { addBowelMovement } from './bowelMovements'
import { addGasEvent } from './gasEvents'
import { getDailySummary } from './summary'

describe('getDailySummary', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns zeroed counts for a day with no entries', () => {
    const summary = getDailySummary(new Date(2026, 0, 15))
    expect(summary.bowelMovementCount).toBe(0)
    expect(summary.gasEventCount).toBe(0)
    expect(summary.averageDurationSeconds).toBeNull()
    expect(summary.lastBowelMovementTimestamp).toBeNull()
  })

  it('counts entries only for the given day', () => {
    addBowelMovement({ timestamp: new Date(2026, 0, 15, 8, 0).toISOString(), durationSeconds: 200 })
    addBowelMovement({ timestamp: new Date(2026, 0, 15, 20, 0).toISOString(), durationSeconds: 400 })
    addGasEvent({ timestamp: new Date(2026, 0, 15, 12, 0).toISOString(), amount: 'small', odor: 'none', context: 'random' })
    addBowelMovement({ timestamp: new Date(2026, 0, 16, 8, 0).toISOString(), durationSeconds: 999 }) // different day

    const summary = getDailySummary(new Date(2026, 0, 15))
    expect(summary.bowelMovementCount).toBe(2)
    expect(summary.gasEventCount).toBe(1)
    expect(summary.averageDurationSeconds).toBe(300) // (200 + 400) / 2
  })

  it('reports the most recent bowel movement timestamp for the day', () => {
    addBowelMovement({ timestamp: new Date(2026, 0, 15, 8, 0).toISOString() })
    addBowelMovement({ timestamp: new Date(2026, 0, 15, 20, 0).toISOString() })

    const summary = getDailySummary(new Date(2026, 0, 15))
    expect(new Date(summary.lastBowelMovementTimestamp!).getHours()).toBe(20)
  })

  it('ignores bowel movements without a recorded duration when averaging', () => {
    addBowelMovement({ timestamp: new Date(2026, 0, 15, 8, 0).toISOString(), durationSeconds: 300 })
    addBowelMovement({ timestamp: new Date(2026, 0, 15, 9, 0).toISOString() }) // no duration

    const summary = getDailySummary(new Date(2026, 0, 15))
    expect(summary.averageDurationSeconds).toBe(300)
  })
})
