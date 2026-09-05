import { useNavigate } from 'react-router-dom'
import { ChevronDown, Pencil, Trash2 } from 'lucide-react'
import type { DigestiveEntry } from '@/types/tracker'
import { summarizeEntry, getEntryDetails } from '@/utils/entrySummary'
import { clsx } from '@/utils/clsx'

interface HistoryEntryCardProps {
  entry: DigestiveEntry
  isExpanded: boolean
  onToggle: () => void
  onRequestDelete: () => void
}

export function HistoryEntryCard({ entry, isExpanded, onToggle, onRequestDelete }: HistoryEntryCardProps) {
  const navigate = useNavigate()
  const date = new Date(entry.data.timestamp)
  const editPath = entry.kind === 'bowel-movement' ? `/log/poop/${entry.data.id}` : `/log/gas/${entry.data.id}`

  return (
    <div className="border border-line-strong rounded-[var(--radius-card)] bg-surface/60 overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isExpanded}
        className="w-full flex items-center gap-3 px-4 py-3 text-left"
      >
        <span className="text-lg shrink-0" aria-hidden="true">
          {entry.kind === 'bowel-movement' ? '💩' : '💨'}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">
            {date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} ·{' '}
            {date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
          </p>
          <p className="text-sm text-ink-soft truncate">
            {entry.kind === 'bowel-movement' ? 'Bowel movement' : 'Gas'} · {summarizeEntry(entry)}
          </p>
        </div>
        <ChevronDown size={18} aria-hidden="true" className={clsx('text-ink-soft transition-transform shrink-0', isExpanded && 'rotate-180')} />
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 flex flex-col gap-3 border-t border-line pt-3">
          <dl className="flex flex-col gap-1.5">
            {getEntryDetails(entry).map((row) => (
              <div key={row.label} className="flex justify-between gap-4 text-sm">
                <dt className="text-ink-soft">{row.label}</dt>
                <dd className="text-right">{row.value}</dd>
              </div>
            ))}
          </dl>
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={() => navigate(editPath)}
              className="flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-ink"
            >
              <Pencil size={14} aria-hidden="true" /> Edit
            </button>
            <button
              type="button"
              onClick={onRequestDelete}
              className="flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-clay-text"
            >
              <Trash2 size={14} aria-hidden="true" /> Delete
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
