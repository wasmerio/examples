/** Resolve a home-page stat value, mirroring partials/stat-value.html.
 *  Reusable from any page that shows a stats strip.
 *  - @pastEventCount           past-event count, rounded ("70+")
 *  - @count:<section>          live entry count of a collection
 *  - @count:<section>:rounded  same, rounded down to "70+" at ten or more
 *  Any other value passes through unchanged. */
const round = (n: number) => (n >= 10 ? `${Math.floor(n / 10) * 10}+` : String(n));

export function formatStat(
  value: string,
  ctx: { pastCount: number; counts: Record<string, number> },
): string {
  if (value === '@pastEventCount') return round(ctx.pastCount);
  if (value.startsWith('@count:')) {
    let rest = value.slice('@count:'.length);
    let rounded = false;
    if (rest.endsWith(':rounded')) {
      rounded = true;
      rest = rest.slice(0, -':rounded'.length);
    }
    const n = ctx.counts[rest] ?? 0;
    return rounded ? round(n) : String(n);
  }
  return value;
}

/** Collection names referenced by @count: values in a stats array. */
export function countSectionsIn(stats: { value: string }[]): string[] {
  const names = new Set<string>();
  for (const s of stats ?? []) {
    if (s?.value?.startsWith('@count:')) {
      names.add(s.value.slice('@count:'.length).replace(/:rounded$/, ''));
    }
  }
  return [...names];
}
