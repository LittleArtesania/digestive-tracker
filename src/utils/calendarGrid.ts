export interface CalendarCell {
  date: Date | null
}

/**
 * Builds a flat array of cells (always a multiple of 7) for a given month,
 * padded with `date: null` before the 1st and after the last day so the
 * grid always lines up into full weeks.
 */
export function buildMonthGrid(year: number, month: number, firstDayOfWeek: 0 | 1): CalendarCell[] {
  const firstOfMonth = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const firstWeekday = firstOfMonth.getDay() // 0 = Sunday
  const leadingBlanks = (firstWeekday - firstDayOfWeek + 7) % 7

  const cells: CalendarCell[] = []
  for (let i = 0; i < leadingBlanks; i++) cells.push({ date: null })
  for (let day = 1; day <= daysInMonth; day++) cells.push({ date: new Date(year, month, day) })
  while (cells.length % 7 !== 0) cells.push({ date: null })

  return cells
}

export function getWeekdayLabels(firstDayOfWeek: 0 | 1): string[] {
  const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  return [...labels.slice(firstDayOfWeek), ...labels.slice(0, firstDayOfWeek)]
}

export function toDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function isSameDay(a: Date, b: Date): boolean {
  return toDateKey(a) === toDateKey(b)
}
