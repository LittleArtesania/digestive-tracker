interface TimeOfDayBucket {
  startHour: number
  endHour: number
  label: string
}

export const TIME_OF_DAY_BUCKETS: TimeOfDayBucket[] = [
  { startHour: 0, endHour: 3, label: '12–3 AM' },
  { startHour: 3, endHour: 6, label: '3–6 AM' },
  { startHour: 6, endHour: 9, label: '6–9 AM' },
  { startHour: 9, endHour: 12, label: '9–12 PM' },
  { startHour: 12, endHour: 15, label: '12–3 PM' },
  { startHour: 15, endHour: 18, label: '3–6 PM' },
  { startHour: 18, endHour: 21, label: '6–9 PM' },
  { startHour: 21, endHour: 24, label: '9 PM–12 AM' },
]

export function getTimeOfDayBucketLabel(date: Date): string {
  const hour = date.getHours()
  const bucket = TIME_OF_DAY_BUCKETS.find((b) => hour >= b.startHour && hour < b.endHour)
  return bucket?.label ?? TIME_OF_DAY_BUCKETS[TIME_OF_DAY_BUCKETS.length - 1].label
}
