function getCalendarDate(date, timeZone) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date).map(({ type, value }) => [type, value]));

  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
  };
}

export function getNextAnniversary(now, { month, day }, timeZone = 'America/Los_Angeles') {
  const current = getCalendarDate(now, timeZone);
  const passedThisYear = current.month > month || (current.month === month && current.day > day);
  const year = current.year + Number(passedThisYear);
  const targetTimestamp = Date.UTC(year, month - 1, day);
  const currentDateTimestamp = Date.UTC(current.year, current.month - 1, current.day);
  const targetDate = new Date(targetTimestamp);

  return {
    date: `${targetDate.getUTCFullYear()}-${String(targetDate.getUTCMonth() + 1).padStart(2, '0')}-${String(targetDate.getUTCDate()).padStart(2, '0')}`,
    daysRemaining: Math.round((targetTimestamp - currentDateTimestamp) / 86_400_000),
  };
}
