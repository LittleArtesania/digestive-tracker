import { useEffect, useState, lazy, Suspense } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ActivityTimeline } from '@/components/timeline/ActivityTimeline'
import { getDailySummary } from '@/storage/summary'
import { getRecentActivity } from '@/storage/activity'
import { getWeeklySummary } from '@/storage/weeklySummary'
import { getSettings } from '@/storage/settings'
import { formatDuration } from '@/utils/duration'
import type { DailySummary } from '@/types/tracker'
import type { WeeklySummary } from '@/storage/weeklySummary'
import type { DigestiveEntry } from '@/types/tracker'

const WeeklyActivityChart = lazy(() =>
  import('@/components/charts/WeeklyActivityChart').then((m) => ({ default: m.WeeklyActivityChart })),
)

export function DashboardPage() {
  const navigate = useNavigate()
  const [summary, setSummary] = useState<DailySummary | null>(null)
  const [activity, setActivity] = useState<DigestiveEntry[]>([])
  const [weekly, setWeekly] = useState<WeeklySummary | null>(null)
  const [privateMode, setPrivateMode] = useState(false)

  useEffect(() => {
    setSummary(getDailySummary())
    setActivity(getRecentActivity())
    setWeekly(getWeeklySummary())
    setPrivateMode(getSettings().privateMode)
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <header>
        <p className="text-sm text-ink-soft">Today</p>
        <h1 className="font-display text-3xl">What's been going on?</h1>
      </header>

      <Card variant="hero" className="flex flex-col gap-1">
        <p className="text-xs uppercase tracking-normal text-ink-soft">Today's summary</p>
        {privateMode ? (
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-display text-4xl">{(summary?.bowelMovementCount ?? 0) + (summary?.gasEventCount ?? 0)}</span>
            <span className="text-sm text-ink-soft">events logged today</span>
          </div>
        ) : (
          <>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-display text-4xl">{summary?.bowelMovementCount ?? 0}</span>
              <span className="text-sm text-ink-soft">💩 logged today</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-4xl">{summary?.gasEventCount ?? 0}</span>
              <span className="text-sm text-ink-soft">💨 gas events today</span>
            </div>
          </>
        )}
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-ink-soft">
          {!privateMode && summary?.averageDurationSeconds != null && (
            <span>Avg. duration: {formatDuration(summary.averageDurationSeconds)}</span>
          )}
          {!privateMode && summary?.lastBowelMovementTimestamp && (
            <span>
              Last one:{' '}
              {new Date(summary.lastBowelMovementTimestamp).toLocaleTimeString(undefined, {
                hour: 'numeric',
                minute: '2-digit',
              })}
            </span>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Button variant="clay" size="lg" fullWidth onClick={() => navigate('/log/poop')}>
          {privateMode ? 'Log' : '💩 Log poop'}
        </Button>
        <Button variant="lavender" size="lg" fullWidth onClick={() => navigate('/log/gas')}>
          {privateMode ? 'Log (other)' : '💨 Log gas'}
        </Button>
      </div>

      <section>
        <h2 className="font-display text-xl mb-3">Latest activity</h2>
        <Card variant="flat">
          <ActivityTimeline entries={activity} privateMode={privateMode} />
        </Card>
      </section>

      <section>
        <h2 className="font-display text-xl mb-3">This week</h2>
        <Card variant="flat" className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            {privateMode ? (
              <div className="col-span-2">
                <p className="font-display text-2xl">{(weekly?.totalBowelMovements ?? 0) + (weekly?.totalGasEvents ?? 0)}</p>
                <p className="text-xs text-ink-soft">total events this week</p>
              </div>
            ) : (
              <>
                <div>
                  <p className="font-display text-2xl">{weekly?.totalBowelMovements ?? 0}</p>
                  <p className="text-xs text-ink-soft">💩 total this week</p>
                </div>
                <div>
                  <p className="font-display text-2xl">{weekly?.totalGasEvents ?? 0}</p>
                  <p className="text-xs text-ink-soft">💨 total this week</p>
                </div>
              </>
            )}
            <div>
              <p className="font-display text-2xl">{weekly?.averageBowelMovementsPerDay ?? 0}</p>
              <p className="text-xs text-ink-soft">{privateMode ? 'avg. per day' : 'avg. 💩 per day'}</p>
            </div>
            <div>
              <p className="font-display text-2xl">
                {weekly?.averageDurationSeconds != null ? formatDuration(weekly.averageDurationSeconds) : '—'}
              </p>
              <p className="text-xs text-ink-soft">avg. duration</p>
            </div>
          </div>

          {weekly && !privateMode && (
            <div>
              <div className="flex items-center gap-4 text-xs text-ink-soft mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-clay inline-block" /> Bowel movements
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-lavender inline-block" /> Gas
                </span>
              </div>
              <Suspense fallback={<div className="h-40 flex items-center justify-center text-xs text-ink-soft">Loading chart…</div>}>
                <WeeklyActivityChart data={weekly.dailyBreakdown} />
              </Suspense>
            </div>
          )}
        </Card>
      </section>
    </div>
  )
}
