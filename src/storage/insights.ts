import type { StoolType, GasAmount, GasOdor, GasContext } from '@/types/tracker'
import { getAllBowelMovements } from './bowelMovements'
import { getAllGasEvents } from './gasEvents'
import { computeMode } from '@/utils/mode'
import { getTimeOfDayBucketLabel } from '@/utils/timeOfDay'
import { formatDuration } from '@/utils/duration'
import { getOptionLabel } from '@/utils/optionLabel'
import { GAS_CONTEXT_OPTIONS } from '@/constants/gasEventOptions'

/** Minimum sample size before a "most common X" claim is shown — a single entry isn't a pattern. */
const MIN_SAMPLE_FOR_PATTERN = 5

export interface BowelMovementInsights {
  sampleSize: number
  averagePerDay: number | null
  averageDurationSeconds: number | null
  shortestDurationSeconds: number | null
  longestDurationSeconds: number | null
  mostCommonStoolType: StoolType | null
  mostCommonTimeOfDayLabel: string | null
  percentEasy: number | null
  percentStraining: number | null
}

export interface GasInsights {
  sampleSize: number
  averagePerDay: number | null
  mostCommonTimeOfDayLabel: string | null
  mostCommonAmount: GasAmount | null
  mostCommonOdor: GasOdor | null
  mostCommonContext: GasContext | null
}

export interface InsightsData {
  bowelMovements: BowelMovementInsights
  gas: GasInsights
  patterns: string[]
  hasAnyData: boolean
}

function daysBetweenInclusive(earliest: Date, latest: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24
  const diff = Math.floor((latest.getTime() - earliest.getTime()) / msPerDay)
  return Math.max(diff + 1, 1)
}

function roundToOneDecimal(value: number): number {
  return Math.round(value * 10) / 10
}

export function getInsights(): InsightsData {
  const bowelMovements = getAllBowelMovements()
  const gasEvents = getAllGasEvents()

  const allTimestamps = [...bowelMovements, ...gasEvents].map((e) => new Date(e.timestamp).getTime())
  const trackedDays =
    allTimestamps.length > 0
      ? daysBetweenInclusive(new Date(Math.min(...allTimestamps)), new Date(Math.max(...allTimestamps)))
      : 0

  // ---- Bowel movement stats ----
  const durations = bowelMovements
    .map((e) => e.durationSeconds)
    .filter((v): v is number => typeof v === 'number')

  const stoolTypes = bowelMovements.map((e) => e.stoolType).filter((v): v is StoolType => v !== undefined)
  const easeValues = bowelMovements.map((e) => e.ease).filter((v): v is NonNullable<typeof v> => v !== undefined)
  const strainingValues = bowelMovements
    .map((e) => e.straining)
    .filter((v): v is NonNullable<typeof v> => v !== undefined)

  const bowelMovementInsights: BowelMovementInsights = {
    sampleSize: bowelMovements.length,
    averagePerDay: trackedDays > 0 && bowelMovements.length > 0 ? roundToOneDecimal(bowelMovements.length / trackedDays) : null,
    averageDurationSeconds:
      durations.length > 0 ? Math.round(durations.reduce((sum, v) => sum + v, 0) / durations.length) : null,
    shortestDurationSeconds: durations.length > 0 ? Math.min(...durations) : null,
    longestDurationSeconds: durations.length > 0 ? Math.max(...durations) : null,
    mostCommonStoolType: computeMode(stoolTypes),
    mostCommonTimeOfDayLabel:
      bowelMovements.length > 0
        ? computeMode(bowelMovements.map((e) => getTimeOfDayBucketLabel(new Date(e.timestamp))))
        : null,
    percentEasy:
      easeValues.length > 0
        ? Math.round((easeValues.filter((v) => v === 'easy').length / easeValues.length) * 100)
        : null,
    percentStraining:
      strainingValues.length > 0
        ? Math.round((strainingValues.filter((v) => v !== 'no').length / strainingValues.length) * 100)
        : null,
  }

  // ---- Gas stats ----
  const amounts = gasEvents.map((e) => e.amount)
  const odors = gasEvents.map((e) => e.odor)
  const contexts = gasEvents.map((e) => e.context)

  const gasInsights: GasInsights = {
    sampleSize: gasEvents.length,
    averagePerDay: trackedDays > 0 && gasEvents.length > 0 ? roundToOneDecimal(gasEvents.length / trackedDays) : null,
    mostCommonTimeOfDayLabel:
      gasEvents.length > 0 ? computeMode(gasEvents.map((e) => getTimeOfDayBucketLabel(new Date(e.timestamp)))) : null,
    mostCommonAmount: computeMode(amounts),
    mostCommonOdor: computeMode(odors),
    mostCommonContext: computeMode(contexts),
  }

  // ---- Plain-language patterns (only when the sample size supports the claim) ----
  const patterns: string[] = []

  if (bowelMovements.length >= MIN_SAMPLE_FOR_PATTERN && bowelMovementInsights.mostCommonTimeOfDayLabel) {
    patterns.push(`Your most common bowel movement time is ${bowelMovementInsights.mostCommonTimeOfDayLabel}.`)
  }
  if (bowelMovements.length >= MIN_SAMPLE_FOR_PATTERN && bowelMovementInsights.mostCommonStoolType) {
    patterns.push(`Type ${bowelMovementInsights.mostCommonStoolType} was your most frequently logged stool type.`)
  }
  if (bowelMovementInsights.averageDurationSeconds != null) {
    patterns.push(`Your average bathroom session was ${formatDuration(bowelMovementInsights.averageDurationSeconds)}.`)
  }
  if (bowelMovements.length >= MIN_SAMPLE_FOR_PATTERN && bowelMovementInsights.percentEasy != null) {
    patterns.push(`${bowelMovementInsights.percentEasy}% of your logged bowel movements were marked as easy.`)
  }
  if (gasEvents.length >= MIN_SAMPLE_FOR_PATTERN && gasInsights.mostCommonTimeOfDayLabel) {
    patterns.push(`You log gas most often around ${gasInsights.mostCommonTimeOfDayLabel}.`)
  }
  if (gasEvents.length >= MIN_SAMPLE_FOR_PATTERN && gasInsights.mostCommonContext && gasInsights.mostCommonContext !== 'random') {
    const contextLabel = getOptionLabel(GAS_CONTEXT_OPTIONS, gasInsights.mostCommonContext)
    if (contextLabel) patterns.push(`Gas was most frequently logged ${contextLabel.toLowerCase()}.`)
  }

  return {
    bowelMovements: bowelMovementInsights,
    gas: gasInsights,
    patterns,
    hasAnyData: bowelMovements.length > 0 || gasEvents.length > 0,
  }
}
