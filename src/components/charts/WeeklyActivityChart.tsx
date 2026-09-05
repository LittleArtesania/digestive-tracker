import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import type { WeeklyDayBreakdown } from '@/storage/weeklySummary'

// Hex values match the design tokens (--color-clay / --color-lavender) — Recharts
// needs literal colors, it can't read CSS custom properties.
const CLAY = '#B5562C'
const LAVENDER = '#6F6B9C'

interface WeeklyActivityChartProps {
  data: WeeklyDayBreakdown[]
}

export function WeeklyActivityChart({ data }: WeeklyActivityChartProps) {
  return (
    <div className="h-40 -mx-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barGap={4} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
          <XAxis
            dataKey="dayLabel"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6B5F52' }}
          />
          <Tooltip
            cursor={{ fill: 'transparent' }}
            contentStyle={{
              borderRadius: 10,
              border: '1px solid #E7DDCE',
              fontSize: 12,
              fontFamily: 'Plus Jakarta Sans, sans-serif',
            }}
          />
          <Bar dataKey="bowelMovementCount" name="Bowel movements" fill={CLAY} radius={[4, 4, 0, 0]} maxBarSize={14} />
          <Bar dataKey="gasEventCount" name="Gas events" fill={LAVENDER} radius={[4, 4, 0, 0]} maxBarSize={14} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
