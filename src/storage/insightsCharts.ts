import { BRISTOL_SCALE } from '@/constants/bowelMovementOptions'
import { TIME_OF_DAY_BUCKETS, getTimeOfDayBucketLabel } from '@/utils/timeOfDay'
import { getAllBowelMovements } from './bowelMovements'
import { getAllGasEvents } from './gasEvents'
import { getWeeklySummary } from './weeklySummary'
import type { StoolType } from '@/types/tracker'

export interface ChartPoint {
  label: string
  value: number
}
export interface NullableChartPoint {
  label: string
  value: number | null
}

/** Bowel movement count per day for the last 7 days. */
export function getWeeklyBowelMovementSeries(): ChartPoint[] {
  return getWeeklySummary().dailyBreakdown.map((day) => ({ label: day.dayLabel, value: day.bowelMovementCount }))
}

/** Gas event count per day for the last 7 days. */
export function getWeeklyGasSeries(): ChartPoint[] {
  return getWeeklySummary().dailyBreakdown.map((day) => ({ label: day.dayLabel, value: day.gasEventCount }))
}

/** Average bowel movement duration per day for the last 7 days (null for days with no timed entries). */
export function getWeeklyDurationSeries(): NullableChartPoint[] {
  return getWeeklySummary().dailyBreakdown.map((day) => ({ label: day.dayLabel, value: day.averageDurationSeconds }))
}

/** Count of each Bristol type (1–7) across all logged history. */
export function getStoolTypeDistribution(): ChartPoint[] {
  const bowelMovements = getAllBowelMovements()
  const counts = new Map<StoolType, number>()
  for (const entry of bowelMovements) {
    if (!entry.stoolType) continue
    counts.set(entry.stoolType, (counts.get(entry.stoolType) ?? 0) + 1)
  }
  return BRISTOL_SCALE.map((entry) => ({ label: `Type ${entry.type}`, value: counts.get(entry.type) ?? 0 }))
}

/** Distribution of entries across the day's time-of-day buckets, in chronological order. */
export function getTimeOfDayDistribution(kind: 'bowel-movement' | 'gas-event'): ChartPoint[] {
  const entries = kind === 'bowel-movement' ? getAllBowelMovements() : getAllGasEvents()
  const counts = new Map<string, number>()
  for (const entry of entries) {
    const label = getTimeOfDayBucketLabel(new Date(entry.timestamp))
    counts.set(label, (counts.get(label) ?? 0) + 1)
  }
  return TIME_OF_DAY_BUCKETS.map((bucket) => ({ label: bucket.label, value: counts.get(bucket.label) ?? 0 }))
}
