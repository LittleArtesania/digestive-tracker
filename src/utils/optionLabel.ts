export function getOptionLabel<T extends string | number>(
  options: { value: T; label: string }[],
  value: T | undefined,
): string | undefined {
  if (value === undefined) return undefined
  return options.find((option) => option.value === value)?.label
}
