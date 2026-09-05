import { ActivityTimeline } from '@/components/timeline/ActivityTimeline'
import { getEntriesForDate } from '@/storage/activity'
import { formatDuration } from '@/utils/duration'

interface DayDetailPanelProps {
  date: Date
}

export function DayDetailPanel({ date }: DayDetailPanelProps) {
  const entries = getEntriesForDate(date)
  const bowelMovements = entries.filter((e) => e.kind === 'bowel-movement')
  const gasEvents = entries.filter((e) => e.kind === 'gas-event')

  const durations = bowelMovements
    .map((e) => (e.kind === 'bowel-movement' ? e.data.durationSeconds : undefined))
    .filter((v): v is number => typeof v === 'number')
  const avgDuration =
    durations.length > 0 ? Math.round(durations.reduce((sum, v) => sum + v, 0) / durations.length) : null

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-sm text-ink-soft">
          {date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 text-sm">
        <div>
          <p className="font-display text-2xl">{bowelMovements.length}</p>
          <p className="text-xs text-ink-soft">💩 logged</p>
        </div>
        <div>
          <p className="font-display text-2xl">{gasEvents.length}</p>
          <p className="text-xs text-ink-soft">💨 events</p>
        </div>
        <div>
          <p className="font-display text-2xl">{avgDuration != null ? formatDuration(avgDuration) : '—'}</p>
          <p className="text-xs text-ink-soft">avg. duration</p>
        </div>
      </div>

      <ActivityTimeline entries={entries} />
    </div>
  )
}
