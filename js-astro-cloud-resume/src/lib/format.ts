import type { Locale } from '../i18n/ui';

/** Parses "YYYY", "YYYY-MM" or "YYYY-MM-DD" (validated by the schema). */
function parts(value: string) {
  const [y, m] = value.split('-').map(Number);
  return { year: y ?? 0, month: m };
}

/** "Mar 2024" / "mars 2024", or just "2024" when no month is given. */
export function formatDate(value: string, locale: Locale): string {
  const { year, month } = parts(value);
  if (!month) return String(year);
  return new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(Date.UTC(year, month - 1, 1)),
  );
}

/** Length of a period, e.g. "2 yrs 3 mos" (labels come from the UI dictionary). */
export function duration(
  start: string,
  end: string | undefined,
  units: { year: (n: number) => string; month: (n: number) => string },
  now = new Date(),
): string | undefined {
  const s = parts(start);
  if (!s.month) return undefined;
  const e = end ? parts(end) : { year: now.getUTCFullYear(), month: now.getUTCMonth() + 1 };
  if (!e.month) return undefined;
  const total = (e.year - s.year) * 12 + (e.month - s.month) + 1;
  if (total <= 0) return undefined;
  const years = Math.floor(total / 12);
  const months = total % 12;
  return [years ? units.year(years) : '', months ? units.month(months) : ''].filter(Boolean).join(' ');
}

/** True when an expiry date is in the past. */
export function isExpired(expires: string | undefined, now = new Date()): boolean {
  if (!expires) return false;
  const [y = 0, m = 12, d] = expires.split('-').map(Number);
  const last = d ?? new Date(Date.UTC(y, m, 0)).getUTCDate();
  return Date.UTC(y, m - 1, last, 23, 59, 59) < now.getTime();
}

/** Initials used when no photo is configured. */
export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0]?.toUpperCase())
    .slice(0, 2)
    .join('');
}

/** "https://github.com/jdoe/" -> "github.com/jdoe" */
export function prettyUrl(href: string): string {
  try {
    const u = new URL(href);
    return (u.host.replace(/^www\./, '') + u.pathname).replace(/\/$/, '');
  } catch {
    return href;
  }
}

/** Resolves a `public/` file against the configured base path; URLs pass through. */
export function assetUrl(value: string, base: string): string {
  if (/^(https?:)?\/\//.test(value) || value.startsWith('data:')) return value;
  return `${base.replace(/\/$/, '')}/${value.replace(/^\//, '')}`;
}
