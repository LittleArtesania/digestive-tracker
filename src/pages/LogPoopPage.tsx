import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ChipGroup } from '@/components/ui/ChipGroup'
import { ChipMultiGroup } from '@/components/ui/ChipMultiGroup'
import { DurationField } from '@/components/ui/DurationField'
import { Toast } from '@/components/ui/Toast'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import {
  BRISTOL_SCALE,
  STOOL_COLOR_OPTIONS,
  EASE_OPTIONS,
  STRAINING_OPTIONS,
  FEELING_AFTER_OPTIONS,
  SENSATION_OPTIONS,
} from '@/constants/bowelMovementOptions'
import { addBowelMovement, getBowelMovementById, updateBowelMovement, deleteBowelMovement } from '@/storage/bowelMovements'
import { toDatetimeLocalValue, fromDatetimeLocalValue } from '@/utils/datetime'
import type { StoolColor, Ease, Straining, FeelingAfter, Sensation } from '@/types/tracker'

export function LogPoopPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEditing = !!id

  const [timestamp, setTimestamp] = useState(() => toDatetimeLocalValue(new Date()))
  const [durationSeconds, setDurationSeconds] = useState<number | undefined>(undefined)
  const [stoolType, setStoolType] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7 | undefined>(undefined)
  const [color, setColor] = useState<StoolColor | undefined>(undefined)
  const [ease, setEase] = useState<Ease | undefined>(undefined)
  const [straining, setStraining] = useState<Straining | undefined>(undefined)
  const [feelingAfter, setFeelingAfter] = useState<FeelingAfter | undefined>(undefined)
  const [sensations, setSensations] = useState<Sensation[]>([])
  const [notes, setNotes] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id) return
    const existing = getBowelMovementById(id)
    if (!existing) {
      setNotFound(true)
      return
    }
    setTimestamp(toDatetimeLocalValue(new Date(existing.timestamp)))
    setDurationSeconds(existing.durationSeconds)
    setStoolType(existing.stoolType)
    setColor(existing.color)
    setEase(existing.ease)
    setStraining(existing.straining)
    setFeelingAfter(existing.feelingAfter)
    setSensations(existing.sensations ?? [])
    setNotes(existing.notes ?? '')
  }, [id])

  function handleSave() {
    const payload = {
      timestamp: fromDatetimeLocalValue(timestamp),
      durationSeconds,
      stoolType,
      color,
      ease,
      straining,
      feelingAfter,
      sensations: sensations.length > 0 ? sensations : undefined,
      notes: notes.trim() || undefined,
    }

    if (isEditing && id) {
      updateBowelMovement(id, payload)
    } else {
      addBowelMovement(payload)
    }
    setShowToast(true)
    setTimeout(() => navigate(isEditing ? '/history' : '/'), 500)
  }

  function handleDelete() {
    if (!id) return
    deleteBowelMovement(id)
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
          <h1 className="font-display text-2xl">
            💩 {isEditing ? 'Edit bowel movement' : 'Log a bowel movement'}
          </h1>
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
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold">Date & time</span>
          <input
            type="datetime-local"
            value={timestamp}
            onChange={(e) => setTimestamp(e.target.value)}
            className="border border-line-strong rounded-[var(--radius-chip)] px-3 py-2 text-sm bg-surface"
          />
        </label>

        <DurationField seconds={durationSeconds} onChange={setDurationSeconds} />

        <ChipGroup
          legend="Bristol type (optional)"
          options={BRISTOL_SCALE.map((entry) => ({ value: entry.type, label: `${entry.type} — ${entry.label}` }))}
          value={stoolType}
          onChange={setStoolType}
        />

        <ChipGroup legend="Color (optional)" options={STOOL_COLOR_OPTIONS} value={color} onChange={setColor} />

        <ChipGroup legend="How easy was it? (optional)" options={EASE_OPTIONS} value={ease} onChange={setEase} />

        <ChipGroup
          legend="Did you strain? (optional)"
          options={STRAINING_OPTIONS}
          value={straining}
          onChange={setStraining}
        />

        <ChipGroup
          legend="How did you feel afterward? (optional)"
          options={FEELING_AFTER_OPTIONS}
          value={feelingAfter}
          onChange={setFeelingAfter}
        />

        <ChipMultiGroup
          legend="Sensations (optional)"
          options={SENSATION_OPTIONS}
          values={sensations}
          onChange={setSensations}
          exclusiveValue="none"
        />

        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold">Notes (optional)</span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Anything you want to remember about this one…"
            className="border border-line-strong rounded-[var(--radius-chip)] px-3 py-2 text-sm bg-surface resize-none"
          />
        </label>
      </Card>

      <Button variant="clay" size="lg" fullWidth onClick={handleSave}>
        {isEditing ? 'Save changes' : 'Save'}
      </Button>

      {showToast && <Toast message={isEditing ? '💩 Updated!' : '💩 Logged!'} onDismiss={() => setShowToast(false)} />}

      {showDeleteConfirm && (
        <ConfirmDialog
          title="Delete this entry?"
          description="This will permanently remove this bowel movement record. This can't be undone."
          confirmLabel="Delete"
          destructive
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </div>
  )
}
