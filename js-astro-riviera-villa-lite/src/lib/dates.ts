/**
 * Calendar dates written YYYY-MM-DD, computed in UTC so summer time never shifts a day.
 * Shared by the booking bar, the booking form and the availability calendar.
 */

/** Booked nights from `start` (first night) to `end` (departure day, not included). */
export interface NightRange {
  start: string;
  end: string;
}

const DAY_MS = 86_400_000;

export function isoToUtcMs(date: string): number {
  const [y, m, d] = date.split('-').map(Number);
  return Date.UTC(y ?? 1970, (m ?? 1) - 1, d ?? 1);
}

export function utcMsToIso(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

export function addDays(date: string, days: number): string {
  return utcMsToIso(isoToUtcMs(date) + days * DAY_MS);
}

export function nightsBetween(start: string, end: string): number {
  return Math.round((isoToUtcMs(end) - isoToUtcMs(start)) / DAY_MS);
}

/** True if no night between arrival (included) and departure (excluded) is booked. */
export function isRangeFree(busy: readonly NightRange[], arrival: string, departure: string): boolean {
  return !busy.some((r) => r.start < departure && r.end > arrival);
}
