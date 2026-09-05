import type { DigestiveEntry } from '@/types/tracker'
import { summarizeEntry } from '@/utils/entrySummary'
import { EmptyState } from '@/components/empty/EmptyState'

interface ActivityTimelineProps {
  entries: DigestiveEntry[]
  /** When true, replaces specific icons/labels/details with generic wording (Settings → Private mode). */
  privateMode?: boolean
}

export function ActivityTimeline({ entries, privateMode = false }: ActivityTimelineProps) {
  if (entries.length === 0) {
    return (
      <EmptyState
        emoji="📋"
        title="Nothing here yet"
        description="Your recent activity will show up on this timeline once you start logging."
      />
    )
  }

  return (
    <ul className="flex flex-col divide-y divide-line">
      {entries.map((entry) => (
        <li key={entry.data.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
          <span className="text-lg shrink-0" aria-hidden="true">
            {privateMode ? '•' : entry.kind === 'bowel-movement' ? '💩' : '💨'}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium">
              {new Date(entry.data.timestamp).toLocaleTimeString(undefined, {
                hour: 'numeric',
                minute: '2-digit',
              })}
            </p>
            <p className="text-sm text-ink-soft truncate">
              {privateMode ? 'Event logged' : `${entry.kind === 'bowel-movement' ? 'Bowel movement' : 'Gas'} · ${summarizeEntry(entry)}`}
            </p>
          </div>
        </li>
      ))}
    </ul>
  )
}
