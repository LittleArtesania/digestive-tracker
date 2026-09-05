import type { BowelMovement, GasEvent, StoolColor, Ease, Straining, FeelingAfter, GasAmount, GasOdor, GasContext } from '@/types/tracker'
import { addBowelMovement } from './bowelMovements'
import { addGasEvent } from './gasEvents'
import { resetAllData } from './backup'

type NewBowelMovement = Omit<BowelMovement, 'id' | 'createdAt' | 'updatedAt'>
type NewGasEvent = Omit<GasEvent, 'id' | 'createdAt' | 'updatedAt'>

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

function pickWeighted<T>(weighted: [T, number][]): T {
  const total = weighted.reduce((sum, [, weight]) => sum + weight, 0)
  let roll = Math.random() * total
  for (const [value, weight] of weighted) {
    roll -= weight
    if (roll <= 0) return value
  }
  return weighted[weighted.length - 1][0]
}

function randomTimeOnDay(day: Date, hourStart: number, hourEnd: number): Date {
  const hour = hourStart + Math.random() * (hourEnd - hourStart)
  const date = new Date(day)
  date.setHours(Math.floor(hour), Math.floor(Math.random() * 60), 0, 0)
  return date
}

const BM_NOTES: (string | undefined)[] = [
  'Felt a bit bloated beforehand.',
  'Right after coffee.',
  'Normal morning routine.',
  undefined,
  undefined,
  undefined,
]

/** Generates ~21 days of plausible-looking (but fake) history — for taking product screenshots, not for real use. */
export function generateDemoDataset(): { bowelMovements: NewBowelMovement[]; gasEvents: NewGasEvent[] } {
  const bowelMovements: NewBowelMovement[] = []
  const gasEvents: NewGasEvent[] = []
  const today = new Date()

  for (let dayOffset = 20; dayOffset >= 0; dayOffset--) {
    const day = new Date(today)
    day.setDate(day.getDate() - dayOffset)

    // Most days have 1, sometimes 2 bowel movements.
    const bmCount = pickWeighted<number>([[1, 6], [2, 3], [0, 1]])
    for (let i = 0; i < bmCount; i++) {
      const timestamp = i === 0 ? randomTimeOnDay(day, 6.5, 9.5) : randomTimeOnDay(day, 17, 21)
      const stoolType = pickWeighted<1 | 2 | 3 | 4 | 5 | 6 | 7>([[3, 3], [4, 5], [5, 2], [2, 1], [6, 1]])
      const color = pickWeighted<StoolColor>([['brown', 5], ['light-brown', 2], ['dark-brown', 2], ['yellow', 1]])
      const ease = pickWeighted<Ease>([['easy', 6], ['normal', 3], ['difficult', 1]])
      const straining = pickWeighted<Straining>([['no', 7], ['a-little', 2], ['yes', 1]])
      const feelingAfter = pickWeighted<FeelingAfter>([['relieved', 7], ['mostly-relieved', 2], ['still-needed', 1]])
      const durationSeconds = Math.round(120 + Math.random() * 480)

      bowelMovements.push({
        timestamp: timestamp.toISOString(),
        durationSeconds,
        stoolType,
        color,
        ease,
        straining,
        feelingAfter,
        sensations: Math.random() < 0.2 ? ['bloating'] : undefined,
        notes: pickRandom(BM_NOTES),
      })
    }

    // 2-5 gas events spread through the day.
    const gasCount = 2 + Math.floor(Math.random() * 4)
    for (let i = 0; i < gasCount; i++) {
      const timestamp = randomTimeOnDay(day, 8, 22)
      const amount = pickWeighted<GasAmount>([['small', 5], ['medium', 3], ['lot', 1]])
      const odor = pickWeighted<GasOdor>([['none', 4], ['mild', 4], ['strong', 1], ['very-strong', 1]])
      const context = pickWeighted<GasContext>([['random', 4], ['after-eating', 4], ['before-bm', 1], ['during-bm', 1]])

      gasEvents.push({
        timestamp: timestamp.toISOString(),
        amount,
        odor,
        context,
      })
    }
  }

  return { bowelMovements, gasEvents }
}

/** Wipes current data and replaces it with the synthetic dataset. Demo/preview use only. */
export function loadDemoData(): void {
  resetAllData()
  const { bowelMovements, gasEvents } = generateDemoDataset()
  for (const entry of bowelMovements) addBowelMovement(entry)
  for (const entry of gasEvents) addGasEvent(entry)
}
