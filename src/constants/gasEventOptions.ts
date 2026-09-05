import type { GasAmount, GasOdor, GasContext } from '@/types/tracker'

export const GAS_AMOUNT_OPTIONS: { value: GasAmount; label: string; emoji: string }[] = [
  { value: 'small', label: 'Small', emoji: '💨' },
  { value: 'medium', label: 'Medium', emoji: '💨💨' },
  { value: 'lot', label: 'A lot', emoji: '💨💨💨' },
]

export const GAS_ODOR_OPTIONS: { value: GasOdor; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'mild', label: 'Mild' },
  { value: 'strong', label: 'Strong' },
  { value: 'very-strong', label: 'Very strong' },
]

export const GAS_CONTEXT_OPTIONS: { value: GasContext; label: string }[] = [
  { value: 'random', label: 'Random' },
  { value: 'after-eating', label: 'After eating' },
  { value: 'before-bm', label: 'Before a bowel movement' },
  { value: 'during-bm', label: 'During a bowel movement' },
]

export const GAS_DEFAULTS: { odor: GasOdor; context: GasContext } = {
  odor: 'none',
  context: 'random',
}
