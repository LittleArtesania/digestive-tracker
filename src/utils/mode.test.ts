import { describe, it, expect } from 'vitest'
import { computeMode } from './mode'

describe('computeMode', () => {
  it('returns null for an empty array', () => {
    expect(computeMode([])).toBeNull()
  })

  it('returns the only value for a single-item array', () => {
    expect(computeMode(['a'])).toBe('a')
  })

  it('returns the most frequent value', () => {
    expect(computeMode([1, 2, 2, 3, 2])).toBe(2)
  })

  it('breaks ties by whichever value appeared first', () => {
    expect(computeMode(['a', 'b', 'a', 'b'])).toBe('a')
  })

  it('works with numeric stool types', () => {
    expect(computeMode([4, 4, 4, 3, 5])).toBe(4)
  })
})
