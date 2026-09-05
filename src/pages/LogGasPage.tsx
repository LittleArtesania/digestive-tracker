import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ChipGroup } from '@/components/ui/ChipGroup'
import { Toast } from '@/components/ui/Toast'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { GAS_AMOUNT_OPTIONS, GAS_ODOR_OPTIONS, GAS_CONTEXT_OPTIONS, GAS_DEFAULTS } from '@/constants/gasEventOptions'
import { addGasEvent, getGasEventById, updateGasEvent, deleteGasEvent } from '@/storage/gasEvents'
import { toDatetimeLocalValue, fromDatetimeLocalValue } from '@/utils/datetime'
import type { GasAmount, GasOdor, GasContext } from '@/types/tracker'
import { clsx } from '@/utils/clsx'

export function LogGasPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEditing = !!id

  const [timestamp, setTimestamp] = useState(() => toDatetimeLocalValue(new Date()))
  const [amount, setAmount] = useState<GasAmount | undefined>(undefined)
  const [odor, setOdor] = useState<GasOdor>(GAS_DEFAULTS.odor)
  const [context, setContext] = useState<GasContext>(GAS_DEFAULTS.context)
  const [notes, setNotes] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id) return
    const existing = getGasEventById(id)
    if (!existing) {
      setNotFound(true)
      return
    }
    setTimestamp(toDatetimeLocalValue(new Date(existing.timestamp)))
    setAmount(existing.amount)
    setOdor(existing.odor)
    setContext(existing.context)
    setNotes(existing.notes ?? '')
  }, [id])

  function save(finalAmount: GasAmount) {
    const payload = {
      timestamp: fromDatetimeLocalValue(timestamp),
      amount: finalAmount,
      odor,
      context,
      notes: notes.trim() || undefined,
    }
    if (isEditing && id) {
      updateGasEvent(id, payload)
    } else {
      addGasEvent(payload)
    }
    setShowToast(true)
    setTimeout(() => navigate(isEditing ? '/history' : '/'), 450)
  }

  // In create mode, tapping an amount saves immediately — that's what makes it fast.
  // In edit mode, tapping just selects, and an explicit "Save changes" button applies it.
  function handleAmountTap(value: GasAmount) {
    if (isEditing) {
      setAmount(value)
    } else {
      save(value)
    }
  }

  function handleDelete() {
    if (!id) return
    deleteGasEvent(id)
    navigate('/history')
  }

  if (notFound) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm text-ink-soft">This entry no longer exists.</p>
        <Button variant="quiet" onClick={() => navigate('/history')}>
          Back to history
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 pb-8">
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(isEditing ? '/history' : '/log')}
            aria-label="Back"
            className="text-ink-soft hover:text-ink p-2 -m-2 rounded-full"
          >
            <ArrowLeft size={20} aria-hidden="true" />
          </button>
          <h1 className="font-display text-2xl">💨 {isEditing ? 'Edit gas event' : 'Log gas'}</h1>
        </div>
        {isEditing && (
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            aria-label="Delete entry"
            className="text-ink-soft hover:text-clay-text p-2 -m-2 rounded-full"
          >
            <Trash2 size={18} aria-hidden="true" />
          </button>
        )}
      </header>

      <Card variant="flat" className="flex flex-col gap-6">
        <ChipGroup legend="Odor" options={GAS_ODOR_OPTIONS} value={odor} onChange={setOdor} />
        <ChipGroup legend="Context" options={GAS_CONTEXT_OPTIONS} value={context} onChange={setContext} />

        <details className="group" open={isEditing}>
          <summary className="text-sm font-semibold text-ink-soft cursor-pointer select-none list-none flex items-center gap-1">
            More options
            <span className="transition-transform group-open:rotate-90">›</span>
          </summary>
          <div className="mt-4 flex flex-col gap-4">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold">Date & time</span>
              <input
                type="datetime-local"
                value={timestamp}
                onChange={(e) => setTimestamp(e.target.value)}
                className="border border-line-strong rounded-[var(--radius-chip)] px-3 py-2 text-sm bg-surface"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold">Notes</span>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Optional note…"
                className="border border-line-strong rounded-[var(--radius-chip)] px-3 py-2 text-sm bg-surface resize-none"
              />
            </label>
          </div>
        </details>
      </Card>

      <div>
        <p className="text-sm font-semibold mb-2">{isEditing ? 'Amount' : 'Amount — tap to save'}</p>
        <div className="grid grid-cols-3 gap-3">
          {GAS_AMOUNT_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleAmountTap(option.value)}
              className={clsx(
                'flex flex-col items-center gap-2 py-6 rounded-[var(--radius-card)] border transition-all active:scale-[0.97]',
                isEditing && amount === option.value
                  ? 'bg-lavender text-on-accent border-lavender'
                  : 'bg-lavender-dim border-lavender-soft hover:bg-lavender-soft text-ink',
              )}
            >
              <span className="text-2xl" aria-hidden="true">
                {option.emoji}
              </span>
              <span className="text-sm font-semibold">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {isEditing && (
        <Button variant="lavender" size="lg" fullWidth disabled={!amount} onClick={() => amount && save(amount)}>
          Save changes
        </Button>
      )}

      {showToast && (
        <Toast message={isEditing ? '💨 Updated!' : '💨 Gas logged!'} onDismiss={() => setShowToast(false)} />
      )}

      {showDeleteConfirm && (
        <ConfirmDialog
          title="Delete this entry?"
          description="This will permanently remove this gas event record. This can't be undone."
          confirmLabel="Delete"
          destructive
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </div>
  )
}
