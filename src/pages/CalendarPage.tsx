import { useEffect, useMemo, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { MonthGrid } from '@/components/calendar/MonthGrid'
import { DayDetailPanel } from '@/components/calendar/DayDetailPanel'
import { getMonthActivityMap } from '@/storage/monthSummary'
import { getSettings } from '@/storage/settings'
import type { DayActivityCounts } from '@/storage/monthSummary'

export function CalendarPage() {
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const now = new Date()
    return { year: now.getFullYear(), month: now.getMonth() }
  })
  const [selectedDate, setSelectedDate] = useState<Date | null>(() => new Date())
  const [activityMap, setActivityMap] = useState<Map<string, DayActivityCounts>>(new Map())
  const [firstDayOfWeek, setFirstDayOfWeek] = useState<0 | 1>(0)

  useEffect(() => {
    setFirstDayOfWeek(getSettings().firstDayOfWeek)
  }, [])

  useEffect(() => {
    setActivityMap(getMonthActivityMap(visibleMonth.year, visibleMonth.month))
  }, [visibleMonth])

  const hasAnyActivityThisMonth = useMemo(() => activityMap.size > 0, [activityMap])

  function goToPrevMonth() {
    setVisibleMonth(({ year, month }) => (month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 }))
  }

  function goToNextMonth() {
    setVisibleMonth(({ year, month }) => (month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 }))
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-display text-3xl">Calendar</h1>
        <p className="text-sm text-ink-soft mt-1">Your activity, month by month.</p>
      </header>

      <Card variant="flat">
        <MonthGrid
          year={visibleMonth.year}
          month={visibleMonth.month}
          firstDayOfWeek={firstDayOfWeek}
          activityMap={activityMap}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          onPrevMonth={goToPrevMonth}
          onNextMonth={goToNextMonth}
        />
        {!hasAnyActivityThisMonth && (
          <p className="text-xs text-ink-soft text-center mt-3">No entries logged this month yet.</p>
        )}
      </Card>

      {selectedDate && (
        <Card variant="flat">
          <DayDetailPanel date={selectedDate} />
        </Card>
      )}
    </div>
  )
}
