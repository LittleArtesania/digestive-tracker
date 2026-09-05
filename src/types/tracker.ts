// ---- Shared enums (kept as string unions so they serialize cleanly to JSON) ----

/** Bristol Stool Scale, described neutrally — no medical framing. */
export type StoolType = 1 | 2 | 3 | 4 | 5 | 6 | 7

export type StoolColor =
  | 'brown'
  | 'light-brown'
  | 'dark-brown'
  | 'green'
  | 'yellow'
  | 'very-dark'
  | 'other'

export type Ease = 'easy' | 'normal' | 'difficult'

export type Straining = 'no' | 'a-little' | 'yes'

export type FeelingAfter = 'relieved' | 'mostly-relieved' | 'still-needed'

export type Sensation = 'bloating' | 'cramping' | 'pain' | 'urgency' | 'incomplete' | 'none'

export type GasAmount = 'small' | 'medium' | 'lot'

export type GasOdor = 'none' | 'mild' | 'strong' | 'very-strong'

export type GasContext = 'random' | 'after-eating' | 'before-bm' | 'during-bm'

export type ThemePreference = 'light' | 'dark' | 'system'

export type TimeFormat = '12h' | '24h'

export type DateFormat = 'mdy' | 'dmy' | 'ymd'

// ---- Core records ----

interface BaseRecord {
  id: string
  /** ISO timestamp of when the event actually happened (user-editable). */
  timestamp: string
  notes?: string
  /** ISO timestamp of when the record was first saved (not user-editable). */
  createdAt: string
  /** ISO timestamp of the last edit. */
  updatedAt: string
}

export interface BowelMovement extends BaseRecord {
  durationSeconds?: number
  stoolType?: StoolType
  color?: StoolColor
  ease?: Ease
  straining?: Straining
  sensations?: Sensation[]
  feelingAfter?: FeelingAfter
  /** Reserved for future food-tracking correlation (see architecture notes). Not populated in MVP. */
  relatedFoodEntryIds?: string[]
}

export interface GasEvent extends BaseRecord {
  amount: GasAmount
  odor: GasOdor
  context: GasContext
  relatedFoodEntryIds?: string[]
}

/** Anything a user can create by logging — used where code treats both kinds uniformly. */
export type DigestiveEntry =
  | { kind: 'bowel-movement'; data: BowelMovement }
  | { kind: 'gas-event'; data: GasEvent }

// ---- Settings ----

export interface AppSettings {
  dateFormat: DateFormat
  timeFormat: TimeFormat
  /** 0 = Sunday, 1 = Monday, matches Date#getDay(). */
  firstDayOfWeek: 0 | 1
  privateMode: boolean
  theme: ThemePreference
  hasCompletedOnboarding: boolean
}

// ---- Derived / computed (never persisted directly) ----

export interface DailySummary {
  /** Calendar date this summary describes, as YYYY-MM-DD in the user's local time. */
  date: string
  bowelMovementCount: number
  gasEventCount: number
  averageDurationSeconds: number | null
  lastBowelMovementTimestamp: string | null
}

// ---- Backup / restore ----

export interface BackupPayload {
  /** Bump this whenever the shape of stored data changes, so imports can be migrated. */
  version: 1
  exportedAt: string
  bowelMovements: BowelMovement[]
  gasEvents: GasEvent[]
  settings: AppSettings
}
