import { useCallback, useEffect, useRef, useState } from 'react'

const ACTIVE_TIMER_KEY = 'digestive-tracker:active-timer'

function readStartedAt(): number | null {
  const raw = window.localStorage.getItem(ACTIVE_TIMER_KEY)
  if (!raw) return null
  const parsed = Number(raw)
  return Number.isFinite(parsed) ? parsed : null
}

/**
 * Because the elapsed time is always derived from `Date.now() - startedAt`
 * (persisted to localStorage), locking the screen or backgrounding the tab
 * never loses time — there's no interval to pause, just a clock to re-read.
 */
export function useBathroomTimer() {
  const [startedAt, setStartedAt] = useState<number | null>(() => readStartedAt())
  const [elapsedSeconds, setElapsedSeconds] = useState(() => {
    const start = readStartedAt()
    return start ? Math.floor((Date.now() - start) / 1000) : 0
  })
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (startedAt === null) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }
    intervalRef.current = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startedAt) / 1000))
    }, 1000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [startedAt])

  const start = useCallback(() => {
    const now = Date.now()
    window.localStorage.setItem(ACTIVE_TIMER_KEY, String(now))
    setStartedAt(now)
    setElapsedSeconds(0)
  }, [])

  /** Stops the timer and returns the final elapsed seconds. */
  const finish = useCallback((): number => {
    const finalElapsed = startedAt ? Math.floor((Date.now() - startedAt) / 1000) : elapsedSeconds
    window.localStorage.removeItem(ACTIVE_TIMER_KEY)
    setStartedAt(null)
    return finalElapsed
  }, [startedAt, elapsedSeconds])

  return {
    isRunning: startedAt !== null,
    elapsedSeconds,
    start,
    finish,
  }
}
