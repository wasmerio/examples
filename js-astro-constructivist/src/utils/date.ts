export function getYear(date: string | null | undefined): string | null {
  if (!date)
    return null

  const year = date.slice(0, 4)
  return /^\d{4}$/.test(year)
    ? year
    : null
}

export function formatDateRange(
  start: string,
  end?: string | null,
  ongoing = 'Present',
): string {
  return `${getYear(start) ?? start} - ${getYear(end) ?? ongoing}`
}

export function formatPeriod(
  start: string,
  end?: string | null,
  ongoing = 'NOW',
): string {
  const startLabel = start.slice(0, 7).replace('-', '.')
  const endLabel = end
    ? end.slice(0, 7).replace('-', '.')
    : ongoing
  return `${startLabel} → ${endLabel}`
}
