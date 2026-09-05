import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import type { ReactNode } from 'react'
import type { ChartPoint, NullableChartPoint } from '@/storage/insightsCharts'
import { formatDuration } from '@/utils/duration'

// Hex values match the design tokens — Recharts needs literal colors, not CSS custom properties.
const CLAY = '#B5562C'
const LAVENDER = '#6F6B9C'
const SAGE = '#7C9B74'

const AXIS_TICK = { fontSize: 11, fill: '#6B5F52' }
const TOOLTIP_STYLE = {
  borderRadius: 10,
  border: '1px solid #E7DDCE',
  fontSize: 12,
  fontFamily: 'Plus Jakarta Sans, sans-serif',
}

interface InsightsChartsSectionProps {
  weeklyBowelMovements: ChartPoint[]
  weeklyGas: ChartPoint[]
  weeklyDuration: NullableChartPoint[]
  stoolTypeDistribution: ChartPoint[]
  timeOfDayDistribution: ChartPoint[]
}

function ChartBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-sm font-semibold mb-2">{title}</p>
      <div className="h-40 -mx-2">{children}</div>
    </div>
  )
}

export function InsightsChartsSection({
  weeklyBowelMovements,
  weeklyGas,
  weeklyDuration,
  stoolTypeDistribution,
  timeOfDayDistribution,
}: InsightsChartsSectionProps) {
  return (
    <div className="flex flex-col gap-6">
      <ChartBlock title="Weekly bowel movements">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyBowelMovements} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
            <XAxis dataKey="label" axisLine={false} tickLine={false} tick={AXIS_TICK} />
            <Tooltip cursor={{ fill: 'transparent' }} contentStyle={TOOLTIP_STYLE} />
            <Bar dataKey="value" name="Bowel movements" fill={CLAY} radius={[4, 4, 0, 0]} maxBarSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </ChartBlock>

      <ChartBlock title="Gas activity">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={weeklyGas} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
            <XAxis dataKey="label" axisLine={false} tickLine={false} tick={AXIS_TICK} />
            <Tooltip cursor={{ stroke: '#E7DDCE' }} contentStyle={TOOLTIP_STYLE} />
            <Line
              type="monotone"
              dataKey="value"
              name="Gas events"
              stroke={LAVENDER}
              strokeWidth={2.5}
              dot={{ r: 3, fill: LAVENDER }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartBlock>

      <ChartBlock title="Poop duration">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={weeklyDuration} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
            <XAxis dataKey="label" axisLine={false} tickLine={false} tick={AXIS_TICK} />
            <Tooltip
              cursor={{ stroke: '#E7DDCE' }}
              contentStyle={TOOLTIP_STYLE}
              formatter={(value) => (typeof value === 'number' ? formatDuration(value) : '—')}
            />
            <Line
              type="monotone"
              dataKey="value"
              name="Avg. duration"
              stroke={SAGE}
              strokeWidth={2.5}
              dot={{ r: 3, fill: SAGE }}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartBlock>

      <ChartBlock title="Stool type distribution">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={stoolTypeDistribution} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
            <XAxis dataKey="label" axisLine={false} tickLine={false} tick={AXIS_TICK} />
            <Tooltip cursor={{ fill: 'transparent' }} contentStyle={TOOLTIP_STYLE} />
            <Bar dataKey="value" name="Times logged" fill={CLAY} radius={[4, 4, 0, 0]} maxBarSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </ChartBlock>

      <ChartBlock title="Time of day">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={timeOfDayDistribution} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
            <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ ...AXIS_TICK, fontSize: 9 }} interval={0} angle={-30} textAnchor="end" height={40} />
            <Tooltip cursor={{ fill: 'transparent' }} contentStyle={TOOLTIP_STYLE} />
            <Bar dataKey="value" name="Bowel movements" fill={CLAY} radius={[4, 4, 0, 0]} maxBarSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </ChartBlock>
    </div>
  )
}
