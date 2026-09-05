import { describe, it, expect } from 'vitest'
import { getTimeOfDayBucketLabel } from './timeOfDay'

function atHour(hour: number, minute = 0): Date {
  const d = new Date(2026, 0, 1)
  d.setHours(hour, minute, 0, 0)
  return d
}

describe('getTimeOfDayBucketLabel', () => {
  it('buckets midnight into the first bucket', () => {
    expect(getTimeOfDayBucketLabel(atHour(0))).toBe('12–3 AM')
  })

  it('buckets a morning hour correctly', () => {
    expect(getTimeOfDayBucketLabel(atHour(8, 15))).toBe('6–9 AM')
  })

  it('respects the bucket boundary (9:00 belongs to the next bucket, not the previous)', () => {
    expect(getTimeOfDayBucketLabel(atHour(9, 0))).toBe('9–12 PM')
    expect(getTimeOfDayBucketLabel(atHour(8, 59))).toBe('6–9 AM')
  })

  it('buckets the last hour of the day', () => {
    expect(getTimeOfDayBucketLabel(atHour(23, 30))).toBe('9 PM–12 AM')
  })
})
