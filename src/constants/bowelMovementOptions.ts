import type { StoolColor, Ease, Straining, FeelingAfter, Sensation } from '@/types/tracker'

export const BRISTOL_SCALE: { type: 1 | 2 | 3 | 4 | 5 | 6 | 7; label: string }[] = [
  { type: 1, label: 'Separate hard lumps' },
  { type: 2, label: 'Lumpy and sausage-like' },
  { type: 3, label: 'Sausage with cracks on the surface' },
  { type: 4, label: 'Smooth and soft' },
  { type: 5, label: 'Soft blobs with clear edges' },
  { type: 6, label: 'Mushy, ragged edges' },
  { type: 7, label: 'Liquid, no solid pieces' },
]

export function getBristolFullLabel(type: 1 | 2 | 3 | 4 | 5 | 6 | 7): string {
  const entry = BRISTOL_SCALE.find((e) => e.type === type)
  return entry ? `${entry.type} — ${entry.label}` : `Type ${type}`
}

export const STOOL_COLOR_OPTIONS: { value: StoolColor; label: string }[] = [
  { value: 'brown', label: 'Brown' },
  { value: 'light-brown', label: 'Light brown' },
  { value: 'dark-brown', label: 'Dark brown' },
  { value: 'green', label: 'Green' },
  { value: 'yellow', label: 'Yellow' },
  { value: 'very-dark', label: 'Very dark' },
  { value: 'other', label: 'Other' },
]

export const EASE_OPTIONS: { value: Ease; label: string }[] = [
  { value: 'easy', label: 'Easy' },
  { value: 'normal', label: 'Normal' },
  { value: 'difficult', label: 'Difficult' },
]

export const STRAINING_OPTIONS: { value: Straining; label: string }[] = [
  { value: 'no', label: 'No' },
  { value: 'a-little', label: 'A little' },
  { value: 'yes', label: 'Yes' },
]

export const FEELING_AFTER_OPTIONS: { value: FeelingAfter; label: string }[] = [
  { value: 'relieved', label: 'Relieved' },
  { value: 'mostly-relieved', label: 'Mostly relieved' },
  { value: 'still-needed', label: 'Still felt like I needed to go' },
]

export const SENSATION_OPTIONS: { value: Sensation; label: string }[] = [
  { value: 'bloating', label: 'Bloating' },
  { value: 'cramping', label: 'Cramping' },
  { value: 'pain', label: 'Pain' },
  { value: 'urgency', label: 'Urgency' },
  { value: 'incomplete', label: 'Feeling incomplete' },
  { value: 'none', label: 'None' },
]

/** Quick-select duration ranges, each mapped to a representative number of seconds for storage. */
export const DURATION_QUICK_OPTIONS: { label: string; seconds: number }[] = [
  { label: 'Under 2 min', seconds: 90 },
  { label: '2–5 min', seconds: 210 },
  { label: '5–10 min', seconds: 450 },
  { label: '10–20 min', seconds: 900 },
  { label: '20+ min', seconds: 1200 },
]
