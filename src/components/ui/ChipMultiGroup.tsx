import { clsx } from '@/utils/clsx'

interface ChipOption<T extends string> {
  value: T
  label: string
}

interface ChipMultiGroupProps<T extends string> {
  options: ChipOption<T>[]
  values: T[]
  onChange: (values: T[]) => void
  legend: string
  /** When set, selecting this value clears every other selection (e.g. "None"). */
  exclusiveValue?: T
}

export function ChipMultiGroup<T extends string>({
  options,
  values,
  onChange,
  legend,
  exclusiveValue,
}: ChipMultiGroupProps<T>) {
  function toggle(option: T) {
    if (exclusiveValue && option === exclusiveValue) {
      onChange([exclusiveValue])
      return
    }
    const withoutExclusive = exclusiveValue ? values.filter((v) => v !== exclusiveValue) : values
    const isSelected = withoutExclusive.includes(option)
    onChange(isSelected ? withoutExclusive.filter((v) => v !== option) : [...withoutExclusive, option])
  }

  return (
    <fieldset>
      <legend className="text-sm font-semibold mb-2">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = values.includes(option.value)
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              onClick={() => toggle(option.value)}
              className={clsx(
                'px-4 py-2 rounded-[var(--radius-chip)] text-sm font-medium border transition-colors min-h-[40px]',
                selected
                  ? 'bg-lavender text-on-accent border-lavender'
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
