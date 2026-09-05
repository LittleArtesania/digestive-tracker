import { describe, it, expect } from 'vitest'
import { generateDemoDataset, loadDemoData } from './demoData'
import { getAllBowelMovements } from './bowelMovements'
import { getAllGasEvents } from './gasEvents'
import { getInsights } from './insights'

describe('generateDemoDataset', () => {
  it('produces a plausible number of entries', () => {
    const { bowelMovements, gasEvents } = generateDemoDataset()
    expect(bowelMovements.length).toBeGreaterThanOrEqual(15)
    expect(bowelMovements.length).toBeLessThanOrEqual(45)
    expect(gasEvents.length).toBeGreaterThanOrEqual(40)
    expect(gasEvents.length).toBeLessThanOrEqual(110)
  })

  it('every generated entry has valid, in-range field values', () => {
    const { bowelMovements, gasEvents } = generateDemoDataset()
    for (const entry of bowelMovements) {
      expect(new Date(entry.timestamp).toString()).not.toBe('Invalid Date')
      expect(entry.stoolType).toBeGreaterThanOrEqual(1)
      expect(entry.stoolType).toBeLessThanOrEqual(7)
    }
    for (const entry of gasEvents) {
      expect(['small', 'medium', 'lot']).toContain(entry.amount)
    }
  })
})

describe('loadDemoData', () => {
  it('replaces existing data and the result feeds the insights engine cleanly', () => {
    loadDemoData()
    expect(getAllBowelMovements().length).toBeGreaterThan(0)
    expect(getAllGasEvents().length).toBeGreaterThan(0)

    const insights = getInsights()
    expect(insights.hasAnyData).toBe(true)
    expect(insights.patterns.length).toBeGreaterThan(0)
  })
})
