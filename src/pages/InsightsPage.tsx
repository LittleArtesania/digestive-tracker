import { useEffect, useState, lazy, Suspense } from 'react'
import { Card } from '@/components/ui/Card'
import { StatCell } from '@/components/ui/StatCell'
import { EmptyState } from '@/components/empty/EmptyState'
import { getInsights } from '@/storage/insights'
import type { InsightsData } from '@/storage/insights'
import {
  getWeeklyBowelMovementSeries,
  getWeeklyGasSeries,
  getWeeklyDurationSeries,
  getStoolTypeDistribution,
  getTimeOfDayDistribution,
} from '@/storage/insightsCharts'
import { getBristolFullLabel } from '@/constants/bowelMovementOptions'
import { getOptionLabel } from '@/utils/optionLabel'
import { GAS_AMOUNT_OPTIONS, GAS_ODOR_OPTIONS, GAS_CONTEXT_OPTIONS } from '@/constants/gasEventOptions'
import { formatDuration } from '@/utils/duration'

const InsightsChartsSection = lazy(() =>
  import('@/components/charts/InsightsChartsSection').then((m) => ({ default: m.InsightsChartsSection })),
)

export function InsightsPage() {
  const [insights, setInsights] = useState<InsightsData | null>(null)

  useEffect(() => {
    setInsights(getInsights())
  }, [])

  if (!insights) return null

  if (!insights.hasAnyData) {
    return (
      <div className="flex flex-col gap-6">
        <header>
          <h1 className="font-display text-3xl">Insights</h1>
          <p className="text-sm text-ink-soft mt-1">What your own data has to say.</p>
        </header>
        <Card variant="flat">
          <EmptyState
            emoji="📊"
            title="Your insights are waiting"
            description="Keep logging for a few days and we'll start showing your patterns here."
          />
        </Card>
      </div>
    )
  }

  const { bowelMovements, gas, patterns } = insights

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-display text-3xl">Insights</h1>
        <p className="text-sm text-ink-soft mt-1">What your own data has to say.</p>
      </header>

      <section>
        <h2 className="font-display text-xl mb-3">Bowel movements</h2>
        <Card variant="flat">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <StatCell value={bowelMovements.averagePerDay != null ? String(bowelMovements.averagePerDay) : '—'} label="Avg. per day" />
            <StatCell
              value={bowelMovements.averageDurationSeconds != null ? formatDuration(bowelMovements.averageDurationSeconds) : '—'}
              label="Avg. duration"
            />
            <StatCell
              value={bowelMovements.shortestDurationSeconds != null ? formatDuration(bowelMovements.shortestDurationSeconds) : '—'}
              label="Shortest"
            />
            <StatCell
              value={bowelMovements.longestDurationSeconds != null ? formatDuration(bowelMovements.longestDurationSeconds) : '—'}
              label="Longest"
            />
            <StatCell
              value={bowelMovements.mostCommonStoolType ? getBristolFullLabel(bowelMovements.mostCommonStoolType) : '—'}
              label="Most common type"
            />
            <StatCell value={bowelMovements.mostCommonTimeOfDayLabel ?? '—'} label="Most common time" />
            <StatCell value={bowelMovements.percentEasy != null ? `${bowelMovements.percentEasy}%` : '—'} label="Marked as easy" />
            <StatCell value={bowelMovements.percentStraining != null ? `${bowelMovements.percentStraining}%` : '—'} label="Involved straining" />
          </div>
        </Card>
      </section>

      <section>
        <h2 className="font-display text-xl mb-3">Gas</h2>
        <Card variant="flat">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <StatCell value={gas.averagePerDay != null ? String(gas.averagePerDay) : '—'} label="Avg. per day" />
            <StatCell value={gas.mostCommonTimeOfDayLabel ?? '—'} label="Most common time" />
            <StatCell value={getOptionLabel(GAS_AMOUNT_OPTIONS, gas.mostCommonAmount ?? undefined) ?? '—'} label="Most common amount" />
            <StatCell value={getOptionLabel(GAS_ODOR_OPTIONS, gas.mostCommonOdor ?? undefined) ?? '—'} label="Most common odor" />
            <StatCell value={getOptionLabel(GAS_CONTEXT_OPTIONS, gas.mostCommonContext ?? undefined) ?? '—'} label="Most common context" />
          </div>
        </Card>
      </section>

      <section>
        <h2 className="font-display text-xl mb-3">Patterns</h2>
        <Card variant="tinted">
          {patterns.length > 0 ? (
            <ul className="flex flex-col gap-2 text-sm">
              {patterns.map((sentence) => (
                <li key={sentence}>{sentence}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-ink-soft">Keep logging to unlock more insights.</p>
          )}
        </Card>
      </section>

      <section>
        <h2 className="font-display text-xl mb-3">Charts</h2>
        <Card variant="flat">
          <Suspense fallback={<div className="h-40 flex items-center justify-center text-xs text-ink-soft">Loading charts…</div>}>
            <InsightsChartsSection
              weeklyBowelMovements={getWeeklyBowelMovementSeries()}
              weeklyGas={getWeeklyGasSeries()}
              weeklyDuration={getWeeklyDurationSeries()}
              stoolTypeDistribution={getStoolTypeDistribution()}
              timeOfDayDistribution={getTimeOfDayDistribution('bowel-movement')}
            />
          </Suspense>
        </Card>
      </section>
    </div>
  )
}
