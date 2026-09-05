import { describe, it, expect } from 'vitest'
import { addBowelMovement } from './bowelMovements'
import { addGasEvent } from './gasEvents'
import { getInsights } from './insights'

describe('getInsights', () => {
  it('reports no data when nothing has been logged', () => {
    const insights = getInsights()
    expect(insights.hasAnyData).toBe(false)
    expect(insights.patterns).toHaveLength(0)
  })

  it('computes bowel movement stats correctly from a realistic sample', () => {
    // 6 entries at 8am, type 4, easy/no-strain; 1 outlier at 8pm, type 6, difficult/straining
    for (let i = 0; i < 6; i++) {
      addBowelMovement({
        timestamp: new Date(2026, 0, 1 + i, 8, 0).toISOString(),
        durationSeconds: 300 + i * 10,
        stoolType: 4,
        ease: 'easy',
        straining: 'no',
      })
    }
    addBowelMovement({
      timestamp: new Date(2026, 0, 7, 20, 0).toISOString(),
      durationSeconds: 600,
      stoolType: 6,
      ease: 'difficult',
      straining: 'yes',
    })

    const { bowelMovements } = getInsights()
    expect(bowelMovements.sampleSize).toBe(7)
    expect(bowelMovements.mostCommonStoolType).toBe(4)
    expect(bowelMovements.mostCommonTimeOfDayLabel).toBe('6–9 AM')
    expect(bowelMovements.shortestDurationSeconds).toBe(300)
    expect(bowelMovements.longestDurationSeconds).toBe(600)
    expect(bowelMovements.percentEasy).toBe(86) // 6/7 rounded
    expect(bowelMovements.percentStraining).toBe(14) // 1/7 rounded
  })

  it('computes gas stats correctly', () => {
    for (let i = 0; i < 5; i++) {
      addGasEvent({
        timestamp: new Date(2026, 0, 1 + i, 14, 0).toISOString(),
        amount: 'medium',
        odor: 'mild',
        context: 'after-eating',
      })
    }
    const { gas } = getInsights()
    expect(gas.sampleSize).toBe(5)
    expect(gas.mostCommonAmount).toBe('medium')
    expect(gas.mostCommonContext).toBe('after-eating')
    expect(gas.mostCommonTimeOfDayLabel).toBe('12–3 PM')
  })

  it('withholds "most common" patterns until the sample size is large enough', () => {
    // Only 2 entries — below the 5-entry threshold for pattern claims
    addBowelMovement({ timestamp: new Date(2026, 0, 1, 8, 0).toISOString(), stoolType: 4, durationSeconds: 300 })
    addBowelMovement({ timestamp: new Date(2026, 0, 2, 8, 0).toISOString(), stoolType: 4, durationSeconds: 300 })

    const { patterns } = getInsights()
    expect(patterns.some((p) => p.includes('most common bowel movement time'))).toBe(false)
    expect(patterns.some((p) => p.includes('most frequently logged stool type'))).toBe(false)
    // But the average-duration pattern doesn't need a large sample, so it should still appear
    expect(patterns.some((p) => p.includes('average bathroom session'))).toBe(true)
  })

  it('includes "most common" patterns once the sample size is large enough', () => {
    for (let i = 0; i < 5; i++) {
      addBowelMovement({ timestamp: new Date(2026, 0, 1 + i, 8, 0).toISOString(), stoolType: 4, durationSeconds: 300 })
    }
    const { patterns } = getInsights()
    expect(patterns.some((p) => p.includes('Type 4 was your most frequently logged stool type'))).toBe(true)
  })

  it('never mentions a "random" gas context as a pattern (not a meaningful claim)', () => {
    for (let i = 0; i < 5; i++) {
      addGasEvent({ timestamp: new Date(2026, 0, 1 + i, 14, 0).toISOString(), amount: 'small', odor: 'none', context: 'random' })
    }
    const { patterns } = getInsights()
    expect(patterns.some((p) => p.toLowerCase().includes('logged random'))).toBe(false)
  })

  it('never produces medical claims or diagnostic language', () => {
    for (let i = 0; i < 6; i++) {
      addBowelMovement({
        timestamp: new Date(2026, 0, 1 + i, 8, 0).toISOString(),
        stoolType: 6,
        durationSeconds: 300,
        straining: 'yes',
      })
    }
    const { patterns } = getInsights()
    const forbiddenPhrases = ['you have', 'diagnos', 'disorder', 'ibs', 'constipat', 'abnormal']
    for (const pattern of patterns) {
      for (const phrase of forbiddenPhrases) {
        expect(pattern.toLowerCase()).not.toContain(phrase)
      }
    }
  })
})
