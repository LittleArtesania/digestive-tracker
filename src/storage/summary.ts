import type { DailySummary } from '@/types/tracker'
import { getBowelMovementsForDate } from './bowelMovements'
import { getGasEventsForDate } from './gasEvents'

function toLocalDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getDailySummary(date: Date = new Date()): DailySummary {
  const bowelMovements = getBowelMovementsForDate(date)
  const gasEvents = getGasEventsForDate(date)

  const durations = bowelMovements
    .map((entry) => entry.durationSeconds)
    .filter((value): value is number => typeof value === 'number')

  const averageDurationSeconds =
    durations.length > 0 ? Math.round(durations.reduce((sum, value) => sum + value, 0) / durations.length) : null

  const lastBowelMovementTimestamp = bowelMovements[0]?.timestamp ?? null // already sorted newest-first

  return {
    date: toLocalDateKey(date),
    bowelMovementCount: bowelMovements.length,
    gasEventCount: gasEvents.length,
    averageDurationSeconds,
    lastBowelMovementTimestamp,
  }
}
