import { describe, it, expect } from 'vitest'
import { addBowelMovement } from './bowelMovements'
import { addGasEvent } from './gasEvents'
import { getStoolTypeDistribution, getTimeOfDayDistribution } from './insightsCharts'

describe('getStoolTypeDistribution', () => {
  it('counts every Bristol type from 1 to 7, including zeros', () => {
    addBowelMovement({ timestamp: new Date().toISOString(), stoolType: 4 })
    addBowelMovement({ timestamp: new Date().toISOString(), stoolType: 4 })
    addBowelMovement({ timestamp: new Date().toISOString(), stoolType: 6 })

    const distribution = getStoolTypeDistribution()
    expect(distribution).toHaveLength(7)
    expect(distribution.find((d) => d.label === 'Type 4')?.value).toBe(2)
    expect(distribution.find((d) => d.label === 'Type 6')?.value).toBe(1)
    expect(distribution.find((d) => d.label === 'Type 1')?.value).toBe(0)
  })

  it('ignores entries with no stool type recorded', () => {
    addBowelMovement({ timestamp: new Date().toISOString() }) // no stoolType
    const distribution = getStoolTypeDistribution()
    expect(distribution.every((d) => d.value === 0)).toBe(true)
  })
})

describe('getTimeOfDayDistribution', () => {
  it('buckets bowel movements by time of day in chronological bucket order', () => {
    addBowelMovement({ timestamp: new Date(2026, 0, 1, 7, 0).toISOString() })
    addBowelMovement({ timestamp: new Date(2026, 0, 2, 7, 30).toISOString() })
    addBowelMovement({ timestamp: new Date(2026, 0, 3, 19, 0).toISOString() })

    const distribution = getTimeOfDayDistribution('bowel-movement')
    expect(distribution[0].label).toBe('12–3 AM') // chronological, not sorted by count
    expect(distribution.find((d) => d.label === '6–9 AM')?.value).toBe(2)
    expect(distribution.find((d) => d.label === '6–9 PM')?.value).toBe(1)
  })

  it('keeps gas and bowel movement distributions independent', () => {
    addBowelMovement({ timestamp: new Date(2026, 0, 1, 7, 0).toISOString() })
    addGasEvent({ timestamp: new Date(2026, 0, 1, 13, 0).toISOString(), amount: 'small', odor: 'none', context: 'random' })

    const bmDist = getTimeOfDayDistribution('bowel-movement')
    const gasDist = getTimeOfDayDistribution('gas-event')
    expect(bmDist.find((d) => d.label === '6–9 AM')?.value).toBe(1)
    expect(gasDist.find((d) => d.label === '6–9 AM')?.value).toBe(0)
    expect(gasDist.find((d) => d.label === '12–3 PM')?.value).toBe(1)
  })
})
