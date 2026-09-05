import { getAllBowelMovements } from './bowelMovements'
import { getAllGasEvents } from './gasEvents'

export interface WeeklyDayBreakdown {
  dateKey: string
  dayLabel: string
  bowelMovementCount: number
  gasEventCount: number
  averageDurationSeconds: number | null
}

export interface WeeklySummary {
  totalBowelMovements: number
  totalGasEvents: number
  averageBowelMovementsPerDay: number
  averageDurationSeconds: number | null
  dailyBreakdown: WeeklyDayBreakdown[]
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function toDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/** Rolling 7-day window ending on `referenceDate` (inclusive), oldest first — ready for a chart's x-axis. */
export function getWeeklySummary(referenceDate: Date = new Date()): WeeklySummary {
  const days: Date[] = []
  for (let offset = 6; offset >= 0; offset--) {
    const d = new Date(referenceDate)
    d.setDate(d.getDate() - offset)
    days.push(d)
  }

  const bowelMovements = getAllBowelMovements()
  const gasEvents = getAllGasEvents()

  const dailyBreakdown: WeeklyDayBreakdown[] = days.map((day) => {
    const dateKey = toDateKey(day)
    const dayBowelMovements = bowelMovements.filter((entry) => toDateKey(new Date(entry.timestamp)) === dateKey)
    const gasCount = gasEvents.filter((entry) => toDateKey(new Date(entry.timestamp)) === dateKey).length

    const dayDurations = dayBowelMovements
      .map((entry) => entry.durationSeconds)
      .filter((value): value is number => typeof value === 'number')
    const averageDurationSeconds =
      dayDurations.length > 0
        ? Math.round(dayDurations.reduce((sum, value) => sum + value, 0) / dayDurations.length)
        : null

    return {
      dateKey,
      dayLabel: DAY_LABELS[day.getDay()],
      bowelMovementCount: dayBowelMovements.length,
      gasEventCount: gasCount,
      averageDurationSeconds,
    }
  })

  const totalBowelMovements = dailyBreakdown.reduce((sum, day) => sum + day.bowelMovementCount, 0)
  const totalGasEvents = dailyBreakdown.reduce((sum, day) => sum + day.gasEventCount, 0)

  const weekStartKey = dailyBreakdown[0].dateKey
  const weekEndKey = dailyBreakdown[dailyBreakdown.length - 1].dateKey
  const durationsThisWeek = bowelMovements
    .filter((entry) => {
      const key = toDateKey(new Date(entry.timestamp))
      return key >= weekStartKey && key <= weekEndKey
    })
    .map((entry) => entry.durationSeconds)
    .filter((value): value is number => typeof value === 'number')

  const averageDurationSeconds =
    durationsThisWeek.length > 0
      ? Math.round(durationsThisWeek.reduce((sum, value) => sum + value, 0) / durationsThisWeek.length)
      : null

  return {
    totalBowelMovements,
    totalGasEvents,
    averageBowelMovementsPerDay: Math.round((totalBowelMovements / 7) * 10) / 10,
    averageDurationSeconds,
    dailyBreakdown,
  }
}
