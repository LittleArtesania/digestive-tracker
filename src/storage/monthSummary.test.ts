import { describe, it, expect } from 'vitest'
import { addBowelMovement } from './bowelMovements'
import { addGasEvent } from './gasEvents'
import { getMonthActivityMap } from './monthSummary'

describe('getMonthActivityMap', () => {
  it('counts entries per day within the given month only', () => {
    addBowelMovement({ timestamp: new Date(2026, 8, 3, 8, 0).toISOString() })
    addBowelMovement({ timestamp: new Date(2026, 8, 3, 20, 0).toISOString() })
    addGasEvent({ timestamp: new Date(2026, 8, 3, 12, 0).toISOString(), amount: 'small', odor: 'none', context: 'random' })
    addBowelMovement({ timestamp: new Date(2026, 7, 15).toISOString() }) // August — different month

    const map = getMonthActivityMap(2026, 8) // September (0-indexed)
    const sept3 = map.get('2026-09-03')
    expect(sept3?.bowelMovementCount).toBe(2)
    expect(sept3?.gasEventCount).toBe(1)
    expect(map.has('2026-08-15')).toBe(false)
  })

  it('returns an empty map when nothing was logged that month', () => {
    const map = getMonthActivityMap(2026, 5)
    expect(map.size).toBe(0)
  })
})
