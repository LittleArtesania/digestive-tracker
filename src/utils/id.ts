/** Generates a locally unique ID. No server, no accounts — just needs to be unique on this device. */
export function generateId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  // Fallback for older environments: timestamp + random suffix is unique enough for local-only data.
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}
