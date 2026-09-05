/** Returns the most frequent value in the array, or null if the array is empty. Ties go to whichever value appeared first. */
export function computeMode<T extends string | number>(values: T[]): T | null {
  if (values.length === 0) return null

  const counts = new Map<T, number>()
  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1)
  }

  let best: T | null = null
  let bestCount = 0
  for (const [value, count] of counts) {
    if (count > bestCount) {
      best = value
      bestCount = count
    }
  }
  return best
}
