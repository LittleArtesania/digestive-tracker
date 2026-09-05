interface StatCellProps {
  value: string
  label: string
}

export function StatCell({ value, label }: StatCellProps) {
  return (
    <div>
      <p className="font-display text-2xl">{value}</p>
      <p className="text-xs text-ink-soft">{label}</p>
    </div>
  )
}
