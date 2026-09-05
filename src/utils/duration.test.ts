import { describe, it, expect } from 'vitest'
import { formatDuration } from './duration'

describe('formatDuration', () => {
  it('formats seconds under a minute as just seconds', () => {
    expect(formatDuration(45)).toBe('45s')
  })

  it('formats zero seconds', () => {
    expect(formatDuration(0)).toBe('0s')
  })

  it('formats whole minutes with 0 seconds', () => {
    expect(formatDuration(120)).toBe('2m 0s')
  })

  it('formats minutes and seconds together', () => {
    expect(formatDuration(402)).toBe('6m 42s')
  })

  it('formats durations over an hour as minutes (no hour unit)', () => {
    expect(formatDuration(3661)).toBe('61m 1s')
  })
})
