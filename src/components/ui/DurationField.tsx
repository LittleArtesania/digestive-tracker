import { useState } from 'react'
import { Timer, Square } from 'lucide-react'
import { DURATION_QUICK_OPTIONS } from '@/constants/bowelMovementOptions'
import { useBathroomTimer } from '@/hooks/useBathroomTimer'
import { formatDuration } from '@/utils/duration'
import { Button } from './Button'
import { clsx } from '@/utils/clsx'

interface DurationFieldProps {
  seconds: number | undefined
  onChange: (seconds: number | undefined) => void
}

export function DurationField({ seconds, onChange }: DurationFieldProps) {
  const [mode, setMode] = useState<'quick' | 'timer'>('quick')
  const timer = useBathroomTimer()

  function handleFinishTimer() {
    const finalSeconds = timer.finish()
    onChange(finalSeconds)
  }

  return (
    <fieldset>
      <legend className="text-sm font-semibold mb-2">Duration (optional)</legend>

      <div className="flex gap-2 mb-3">
        <button
          type="button"
          onClick={() => setMode('quick')}
          className={clsx(
            'text-xs font-semibold px-3 py-1.5 rounded-[var(--radius-pill)] border',
            mode === 'quick' ? 'bg-clay text-on-accent border-clay' : 'border-line-strong text-ink-soft',
          )}
        >
          Quick select
        </button>
        <button
          type="button"
          onClick={() => setMode('timer')}
          className={clsx(
            'text-xs font-semibold px-3 py-1.5 rounded-[var(--radius-pill)] border',
            mode === 'timer' ? 'bg-clay text-on-accent border-clay' : 'border-line-strong text-ink-soft',
          )}
        >
          Use a timer
        </button>
      </div>

      {mode === 'quick' && (
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Duration">
          {DURATION_QUICK_OPTIONS.map((option) => {
            const selected = seconds === option.seconds
            return (
              <button
                key={option.label}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => onChange(option.seconds)}
                className={clsx(
                  'px-4 py-2 rounded-[var(--radius-chip)] text-sm font-medium border transition-colors min-h-[40px]',
                  selected
                    ? 'bg-clay text-on-accent border-clay'
                    : 'bg-transparent text-ink border-line-strong hover:border-ink-soft',
                )}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      )}

      {mode === 'timer' && (
        <div className="flex items-center gap-4 bg-paper-dim rounded-[var(--radius-card)] p-4">
          <span className="font-display text-3xl tabular-nums" aria-live="polite">
            {formatDuration(timer.isRunning ? timer.elapsedSeconds : (seconds ?? 0))}
          </span>
          {timer.isRunning ? (
            <Button variant="clay" size="sm" icon={<Square size={14} aria-hidden="true" />} onClick={handleFinishTimer}>
              Finish
            </Button>
          ) : (
            <Button variant="quiet" size="sm" icon={<Timer size={14} aria-hidden="true" />} onClick={timer.start}>
              Start timer
            </Button>
          )}
        </div>
      )}
    </fieldset>
  )
}
