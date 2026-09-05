import { describe, it, expect } from 'vitest'
import { buildMonthGrid, getWeekdayLabels, toDateKey, isSameDay } from './calendarGrid'

describe('buildMonthGrid', () => {
  it('always returns a length that is a multiple of 7', () => {
    // Check every month of a year — some start on different weekdays and have different lengths.
    for (let month = 0; month < 12; month++) {
      const grid = buildMonthGrid(2026, month, 0)
      expect(grid.length % 7).toBe(0)
    }
  })

  it('includes every day of the month exactly once', () => {
    const grid = buildMonthGrid(2026, 8, 0) // September 2026 has 30 days
    const realDays = grid.filter((cell) => cell.date !== null)
    expect(realDays).toHaveLength(30)
    expect(realDays[0].date?.getDate()).toBe(1)
    expect(realDays[realDays.length - 1].date?.getDate()).toBe(30)
  })

  it('pads correctly so the first real day lands under its actual weekday', () => {
    // September 1, 2026 is a Tuesday. With the week starting Sunday, that's 2 leading blanks.
    const grid = buildMonthGrid(2026, 8, 0)
    const firstDayIndex = grid.findIndex((cell) => cell.date !== null)
    expect(firstDayIndex).toBe(2)
  })

  it('shifts padding correctly when the week starts on Monday instead', () => {
    const grid = buildMonthGrid(2026, 8, 1)
    const firstDayIndex = grid.findIndex((cell) => cell.date !== null)
    expect(firstDayIndex).toBe(1)
  })
})

describe('getWeekdayLabels', () => {
  it('starts with Sun when the week starts on Sunday', () => {
    expect(getWeekdayLabels(0)[0]).toBe('Sun')
  })

  it('starts with Mon when the week starts on Monday', () => {
    expect(getWeekdayLabels(1)[0]).toBe('Mon')
  })

  it('always returns 7 labels', () => {
    expect(getWeekdayLabels(0)).toHaveLength(7)
    expect(getWeekdayLabels(1)).toHaveLength(7)
  })
})

describe('toDateKey / isSameDay', () => {
  it('formats a date as YYYY-MM-DD', () => {
    expect(toDateKey(new Date(2026, 8, 3))).toBe('2026-09-03')
  })

  it('pads single-digit months and days', () => {
    expect(toDateKey(new Date(2026, 0, 5))).toBe('2026-01-05')
  })

  it('treats two Date objects on the same day as the same day regardless of time', () => {
    const morning = new Date(2026, 8, 3, 6, 0)
    const night = new Date(2026, 8, 3, 23, 59)
    expect(isSameDay(morning, night)).toBe(true)
  })

  it('treats different days as different', () => {
    expect(isSameDay(new Date(2026, 8, 3), new Date(2026, 8, 4))).toBe(false)
  })
})
