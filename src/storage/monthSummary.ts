import { getAllEntries } from './activity'
import { toDateKey } from '@/utils/calendarGrid'

export interface DayActivityCounts {
  bowelMovementCount: number
  gasEventCount: number
}

/** Maps "YYYY-MM-DD" -> counts, for every day in the given month that has at least one entry. */
export function getMonthActivityMap(year: number, month: number): Map<string, DayActivityCounts> {
  const map = new Map<string, DayActivityCounts>()

  for (const entry of getAllEntries()) {
    const date = new Date(entry.data.timestamp)
    if (date.getFullYear() !== year || date.getMonth() !== month) continue

    const key = toDateKey(date)
    const existing = map.get(key) ?? { bowelMovementCount: 0, gasEventCount: 0 }
    if (entry.kind === 'bowel-movement') existing.bowelMovementCount += 1
    else existing.gasEventCount += 1
    map.set(key, existing)
  }

  return map
}
