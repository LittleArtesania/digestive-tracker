import { useRef } from 'react'
import { clsx } from '@/utils/clsx'

interface ChipOption<T extends string | number> {
  value: T
  label: string
}

interface ChipGroupProps<T extends string | number> {
  options: ChipOption<T>[]
  value: T | undefined
  onChange: (value: T) => void
  /** Renders as a legend for the group, associating it with the chips for screen readers. */
  legend: string
}

export function ChipGroup<T extends string | number>({ options, value, onChange, legend }: ChipGroupProps<T>) {
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([])

  // Native radiogroup keyboard pattern: arrow keys move AND select, Home/End jump to the ends.
  // Tab only ever stops once on the group (see tabIndex below), then arrows take over.
  function handleKeyDown(e: React.KeyboardEvent, index: number) {
    let nextIndex: number | null = null
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') nextIndex = (index + 1) % options.length
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') nextIndex = (index - 1 + options.length) % options.length
    else if (e.key === 'Home') nextIndex = 0
    else if (e.key === 'End') nextIndex = options.length - 1

    if (nextIndex !== null) {
      e.preventDefault()
      onChange(options[nextIndex].value)
      buttonRefs.current[nextIndex]?.focus()
    }
  }

  return (
    <fieldset>
      {legend && <legend className="text-sm font-semibold mb-2">{legend}</legend>}
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={legend}>
        {options.map((option, index) => {
          const selected = option.value === value
          // Roving tabindex: only the selected chip (or the first, if none selected yet) is a tab stop.
          const isTabbable = value === undefined ? index === 0 : selected
          return (
            <button
              key={option.value}
              ref={(el) => {
                buttonRefs.current[index] = el
              }}
              type="button"
              role="radio"
              aria-checked={selected}
              tabIndex={isTabbable ? 0 : -1}
              onClick={() => onChange(option.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
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
    </fieldset>
  )
}
