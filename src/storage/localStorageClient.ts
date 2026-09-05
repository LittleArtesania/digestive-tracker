/**
 * Every other storage module goes through these two functions. Nothing else
 * in the app should call `window.localStorage` directly — that keeps error
 * handling (corrupted JSON, storage quota, private-browsing restrictions)
 * in exactly one place.
 */

export function readFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw) as T
  } catch (error) {
    console.warn(`[storage] Couldn't read "${key}", using fallback.`, error)
    return fallback
  }
}

export function writeToStorage<T>(key: string, value: T): boolean {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.warn(`[storage] Couldn't save "${key}".`, error)
    return false
  }
}

export function removeFromStorage(key: string): void {
  try {
    window.localStorage.removeItem(key)
  } catch (error) {
    console.warn(`[storage] Couldn't remove "${key}".`, error)
  }
}
