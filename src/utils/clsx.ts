type ClassValue = string | number | boolean | null | undefined

/** Minimal className joiner so we don't need an extra dependency. */
export function clsx(...values: ClassValue[]): string {
  return values.filter(Boolean).join(' ')
}
