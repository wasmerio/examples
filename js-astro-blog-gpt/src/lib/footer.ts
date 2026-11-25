export function footerPeriod(
  since: number | string,
  now = new Date(),
  timeZone = 'UTC',
) {
  const start = typeof since === 'number' ? `${since}-01-01` : since;
  const date = new Date(`${start}T00:00:00Z`);
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(start) ||
    !Number.isFinite(date.getTime()) ||
    date.toISOString().slice(0, 10) !== start
  )
    throw new Error('footer.since must be a year or an ISO date (YYYY-MM-DD).');
  const parts = new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone,
  }).formatToParts(now);
  const part = (type: string) =>
    parts.find((value) => value.type === type)!.value;
  const year = part('year');
  const today = Date.parse(`${year}-${part('month')}-${part('day')}T00:00:00Z`);
  return {
    years: start.slice(0, 4) === year ? year : `${start.slice(0, 4)} – ${year}`,
    days: Math.max(0, Math.floor((today - date.getTime()) / 86400000)),
  };
}

export function characterCount(markdown: string): number {
  return (
    markdown
      .replace(/```[\s\S]*?```|~~~[\s\S]*?~~~/g, '')
      .replace(/<[^>]*>/g, '')
      .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
      .match(/[\p{L}\p{N}]/gu) ?? []
  ).length;
}
