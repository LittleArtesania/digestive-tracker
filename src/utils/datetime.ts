/** Formats a Date as the local "YYYY-MM-DDTHH:mm" string a <input type="datetime-local"> expects. */
export function toDatetimeLocalValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  const year = date.getFullYear()
  const month = pad(date.getMonth() + 1)
  const day = pad(date.getDate())
  const hours = pad(date.getHours())
  const minutes = pad(date.getMinutes())
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

/** Parses a datetime-local input value back into an ISO timestamp for storage. */
export function fromDatetimeLocalValue(value: string): string {
  return new Date(value).toISOString()
}
