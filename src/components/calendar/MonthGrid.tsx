import { ChevronLeft, ChevronRight } from 'lucide-react'
import { buildMonthGrid, getWeekdayLabels, toDateKey, isSameDay } from '@/utils/calendarGrid'
import type { DayActivityCounts } from '@/storage/monthSummary'
import { clsx } from '@/utils/clsx'

interface MonthGridProps {
  year: number
  month: number
  firstDayOfWeek: 0 | 1
  activityMap: Map<string, DayActivityCounts>
  selectedDate: Date | null
  onSelectDate: (date: Date) => void
  onPrevMonth: () => void
  onNextMonth: () => void
}

export function MonthGrid({
  year,
  month,
  firstDayOfWeek,
  activityMap,
  selectedDate,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
}: MonthGridProps) {
  const cells = buildMonthGrid(year, month, firstDayOfWeek)
  const weekdayLabels = getWeekdayLabels(firstDayOfWeek)
  const monthLabel = new Date(year, month, 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
  const today = new Date()

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button type="button" onClick={onPrevMonth} aria-label="Previous month" className="p-2.5 -m-1 text-ink-soft hover:text-ink rounded-full">
          <ChevronLeft size={18} aria-hidden="true" />
        </button>
        <p className="font-display text-lg">{monthLabel}</p>
        <button type="button" onClick={onNextMonth} aria-label="Next month" className="p-2.5 -m-1 text-ink-soft hover:text-ink rounded-full">
          <ChevronRight size={18} aria-hidden="true" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs text-ink-soft mb-1">
        {weekdayLabels.map((label) => (
          <div key={label}>{label}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell, index) => {
          if (!cell.date) return <div key={index} />

          const key = toDateKey(cell.date)
          const counts = activityMap.get(key)
          const isSelected = selectedDate && isSameDay(cell.date, selectedDate)
          const isToday = isSameDay(cell.date, today)

          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelectDate(cell.date!)}
              aria-pressed={!!isSelected}
              aria-label={`${cell.date.toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}${isToday ? ', today' : ''}`}
              className={clsx(
                'aspect-square flex flex-col items-center justify-center gap-0.5 rounded-[var(--radius-chip)] text-sm transition-colors',
                isSelected ? 'bg-clay text-on-accent' : isToday ? 'bg-clay-dim text-ink' : 'hover:bg-paper-dim text-ink',
              )}
            >
              <span
                className={clsx(
                  'leading-none',
                  (isSelected || isToday) && 'font-semibold',
                  // Today gets an underline too, so it's never identified by color tint alone.
                  isToday && !isSelected && 'underline decoration-2 underline-offset-2',
                )}
              >
                {cell.date.getDate()}
              </span>
              {counts && (
                <span className="flex items-center gap-0.5 text-[10px] leading-none">
                  {counts.bowelMovementCount > 0 && <span aria-hidden="true">💩</span>}
                  {counts.gasEventCount > 0 && <span aria-hidden="true">💨</span>}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
