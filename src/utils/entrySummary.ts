import type { BowelMovement, GasEvent, DigestiveEntry } from '@/types/tracker'
import { GAS_AMOUNT_OPTIONS, GAS_ODOR_OPTIONS, GAS_CONTEXT_OPTIONS } from '@/constants/gasEventOptions'
import {
  BRISTOL_SCALE,
  STOOL_COLOR_OPTIONS,
  EASE_OPTIONS,
  STRAINING_OPTIONS,
  FEELING_AFTER_OPTIONS,
  SENSATION_OPTIONS,
} from '@/constants/bowelMovementOptions'
import { getOptionLabel } from './optionLabel'
import { formatDuration } from './duration'

// ---- Short one-line summaries (dashboard timeline, collapsed history rows) ----

export function summarizeBowelMovement(entry: BowelMovement): string {
  const parts: string[] = []
  if (entry.stoolType) parts.push(`Type ${entry.stoolType}`)
  if (typeof entry.durationSeconds === 'number') parts.push(formatDuration(entry.durationSeconds))
  return parts.length > 0 ? parts.join(' · ') : 'Logged'
}

export function summarizeGasEvent(entry: GasEvent): string {
  const amountLabel = getOptionLabel(GAS_AMOUNT_OPTIONS, entry.amount) ?? entry.amount
  const odorLabel = getOptionLabel(GAS_ODOR_OPTIONS, entry.odor)

  const parts = [amountLabel]
  if (odorLabel && entry.odor !== 'none') parts.push(`${odorLabel} odor`)
  return parts.join(' · ')
}

export function summarizeEntry(entry: DigestiveEntry): string {
  return entry.kind === 'bowel-movement' ? summarizeBowelMovement(entry.data) : summarizeGasEvent(entry.data)
}

// ---- Full detail breakdowns (expanded history card) ----

export interface DetailRow {
  label: string
  value: string
}

const bristolLabelByType = new Map(BRISTOL_SCALE.map((entry) => [entry.type, `${entry.type} — ${entry.label}`]))

export function getBowelMovementDetails(entry: BowelMovement): DetailRow[] {
  const rows: DetailRow[] = []
  if (typeof entry.durationSeconds === 'number') {
    rows.push({ label: 'Duration', value: formatDuration(entry.durationSeconds) })
  }
  if (entry.stoolType) rows.push({ label: 'Bristol type', value: bristolLabelByType.get(entry.stoolType) ?? String(entry.stoolType) })
  const color = getOptionLabel(STOOL_COLOR_OPTIONS, entry.color)
  if (color) rows.push({ label: 'Color', value: color })
  const ease = getOptionLabel(EASE_OPTIONS, entry.ease)
  if (ease) rows.push({ label: 'Ease', value: ease })
  const straining = getOptionLabel(STRAINING_OPTIONS, entry.straining)
  if (straining) rows.push({ label: 'Straining', value: straining })
  const feelingAfter = getOptionLabel(FEELING_AFTER_OPTIONS, entry.feelingAfter)
  if (feelingAfter) rows.push({ label: 'Afterward', value: feelingAfter })
  if (entry.sensations && entry.sensations.length > 0) {
    const labels = entry.sensations.map((s) => getOptionLabel(SENSATION_OPTIONS, s) ?? s)
    rows.push({ label: 'Sensations', value: labels.join(', ') })
  }
  if (entry.notes) rows.push({ label: 'Notes', value: entry.notes })
  return rows
}

export function getGasEventDetails(entry: GasEvent): DetailRow[] {
  const rows: DetailRow[] = []
  rows.push({ label: 'Amount', value: getOptionLabel(GAS_AMOUNT_OPTIONS, entry.amount) ?? entry.amount })
  rows.push({ label: 'Odor', value: getOptionLabel(GAS_ODOR_OPTIONS, entry.odor) ?? entry.odor })
  rows.push({ label: 'Context', value: getOptionLabel(GAS_CONTEXT_OPTIONS, entry.context) ?? entry.context })
  if (entry.notes) rows.push({ label: 'Notes', value: entry.notes })
  return rows
}

export function getEntryDetails(entry: DigestiveEntry): DetailRow[] {
  return entry.kind === 'bowel-movement' ? getBowelMovementDetails(entry.data) : getGasEventDetails(entry.data)
}
