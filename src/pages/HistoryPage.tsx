import { useEffect, useMemo, useState } from 'react'
import { Search, X } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { EmptyState } from '@/components/empty/EmptyState'
import { HistoryEntryCard } from '@/components/timeline/HistoryEntryCard'
import { getAllEntries, deleteEntry } from '@/storage/activity'
import { summarizeEntry } from '@/utils/entrySummary'
import type { DigestiveEntry } from '@/types/tracker'
import { clsx } from '@/utils/clsx'

type TypeFilter = 'all' | 'bowel-movement' | 'gas-event'

function toDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function HistoryPage() {
  const [entries, setEntries] = useState<DigestiveEntry[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [dateFilter, setDateFilter] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [pendingDelete, setPendingDelete] = useState<DigestiveEntry | null>(null)

  useEffect(() => {
    setEntries(getAllEntries())
  }, [])

  const filteredEntries = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return entries.filter((entry) => {
      if (typeFilter !== 'all' && entry.kind !== typeFilter) return false
      if (dateFilter && toDateKey(new Date(entry.data.timestamp)) !== dateFilter) return false
      if (query) {
        const haystack = `${summarizeEntry(entry)} ${entry.data.notes ?? ''}`.toLowerCase()
        if (!haystack.includes(query)) return false
      }
      return true
    })
  }, [entries, searchQuery, typeFilter, dateFilter])

  function handleConfirmDelete() {
    if (!pendingDelete) return
    deleteEntry(pendingDelete)
    setEntries((prev) => prev.filter((e) => e.data.id !== pendingDelete.data.id))
    setPendingDelete(null)
  }

  const hasAnyEntriesAtAll = entries.length > 0
  const hasActiveFilters = !!searchQuery || typeFilter !== 'all' || !!dateFilter

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-display text-3xl">History</h1>
        <p className="text-sm text-ink-soft mt-1">All your entries, in one place.</p>
      </header>

      {hasAnyEntriesAtAll && (
        <div className="flex flex-col gap-3">
          <div className="relative">
            <Search size={16} aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes and details…"
              aria-label="Search entries"
              className="w-full border border-line-strong rounded-[var(--radius-pill)] pl-9 pr-3 py-2.5 text-sm bg-surface"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(['all', 'bowel-movement', 'gas-event'] as TypeFilter[]).map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setTypeFilter(filter)}
                className={clsx(
                  'px-3.5 py-1.5 rounded-[var(--radius-pill)] text-sm font-medium border',
                  typeFilter === filter ? 'bg-clay text-on-accent border-clay' : 'border-line-strong text-ink-soft',
                )}
              >
                {filter === 'all' ? 'All' : filter === 'bowel-movement' ? '💩 Poop' : '💨 Gas'}
              </button>
            ))}

            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              aria-label="Filter by date"
              className="border border-line-strong rounded-[var(--radius-pill)] px-3 py-1.5 text-sm text-ink-soft bg-surface"
            />
            {hasActiveFilters && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  setTypeFilter('all')
                  setDateFilter('')
                }}
                className="flex items-center gap-1 text-sm text-ink-soft hover:text-ink"
              >
                <X size={14} aria-hidden="true" /> Clear
              </button>
            )}
          </div>
        </div>
      )}

      {filteredEntries.length === 0 ? (
        <Card variant="flat">
          <EmptyState
            emoji={hasAnyEntriesAtAll ? '🔍' : '🗂️'}
            title={hasAnyEntriesAtAll ? 'No matches' : 'Nothing to show yet'}
            description={
              hasAnyEntriesAtAll
                ? 'Try a different search term or clear your filters.'
                : "Once you start logging, you'll see the full list here with search and filters."
            }
          />
        </Card>
      ) : (
        <div className="flex flex-col gap-2">
          {filteredEntries.map((entry) => (
            <HistoryEntryCard
              key={entry.data.id}
              entry={entry}
              isExpanded={expandedId === entry.data.id}
              onToggle={() => setExpandedId((prev) => (prev === entry.data.id ? null : entry.data.id))}
              onRequestDelete={() => setPendingDelete(entry)}
            />
          ))}
        </div>
      )}

      {pendingDelete && (
        <ConfirmDialog
          title="Delete this entry?"
          description={`This will permanently remove this ${
            pendingDelete.kind === 'bowel-movement' ? 'bowel movement' : 'gas event'
          } record. This can't be undone.`}
          confirmLabel="Delete"
          destructive
          onConfirm={handleConfirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  )
}
