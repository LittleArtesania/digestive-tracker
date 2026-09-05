import { describe, it, expect } from 'vitest'
import { addBowelMovement } from './bowelMovements'
import { addGasEvent } from './gasEvents'
import { getWeeklySummary } from './weeklySummary'

describe('getWeeklySummary', () => {
  it('returns a 7-day breakdown ending on the reference date', () => {
    const summary = getWeeklySummary(new Date(2026, 0, 15))
    expect(summary.dailyBreakdown).toHaveLength(7)
    expect(summary.dailyBreakdown[6].dateKey).toBe('2026-01-15')
    expect(summary.dailyBreakdown[0].dateKey).toBe('2026-01-09')
  })

  it('sums totals across the week correctly', () => {
    addBowelMovement({ timestamp: new Date(2026, 0, 10, 8, 0).toISOString(), durationSeconds: 200 })
    addBowelMovement({ timestamp: new Date(2026, 0, 12, 8, 0).toISOString(), durationSeconds: 400 })
    addGasEvent({ timestamp: new Date(2026, 0, 11, 8, 0).toISOString(), amount: 'small', odor: 'none', context: 'random' })
    // Outside the 7-day window ending Jan 15 (window is Jan 9-15)
    addBowelMovement({ timestamp: new Date(2026, 0, 1, 8, 0).toISOString(), durationSeconds: 999 })

    const summary = getWeeklySummary(new Date(2026, 0, 15))
    expect(summary.totalBowelMovements).toBe(2)
    expect(summary.totalGasEvents).toBe(1)
    expect(summary.averageDurationSeconds).toBe(300) // only the two in-window entries
  })

  it('computes average bowel movements per day over all 7 days, not just active days', () => {
    for (let i = 0; i < 7; i++) {
      addBowelMovement({ timestamp: new Date(2026, 0, 9 + i, 8, 0).toISOString() })
    }
    const summary = getWeeklySummary(new Date(2026, 0, 15))
    expect(summary.averageBowelMovementsPerDay).toBe(1) // 7 entries / 7 days
  })

  it('gives each day its own average duration in the breakdown', () => {
    addBowelMovement({ timestamp: new Date(2026, 0, 12, 8, 0).toISOString(), durationSeconds: 100 })
    addBowelMovement({ timestamp: new Date(2026, 0, 12, 20, 0).toISOString(), durationSeconds: 300 })

    const summary = getWeeklySummary(new Date(2026, 0, 15))
    const jan12 = summary.dailyBreakdown.find((d) => d.dateKey === '2026-01-12')
    expect(jan12?.averageDurationSeconds).toBe(200)
    const jan13 = summary.dailyBreakdown.find((d) => d.dateKey === '2026-01-13')
    expect(jan13?.averageDurationSeconds).toBeNull()
  })
})
