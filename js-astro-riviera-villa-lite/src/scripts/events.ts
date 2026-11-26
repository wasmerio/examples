/**
 * The booking bar, the calendar and the booking form share the chosen dates through one
 * window event, so each part works alone and they stay in sync when they are all on the page.
 */
export interface DatesDetail {
  arrival?: string;
  departure?: string;
  guests?: number;
  source: 'bar' | 'calendar' | 'form' | 'url';
}

const DATES_EVENT = 'rt:dates';

export function emitDates(detail: DatesDetail): void {
  window.dispatchEvent(new CustomEvent<DatesDetail>(DATES_EVENT, { detail }));
}

export function onDates(handler: (detail: DatesDetail) => void): void {
  window.addEventListener(DATES_EVENT, (event) => handler((event as CustomEvent<DatesDetail>).detail));
}

const pad = (n: number) => String(n).padStart(2, '0');

/** Today in the visitor's time zone, YYYY-MM-DD. */
export function todayIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function isIsoDate(value: unknown): value is string {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

/** "Sat. 12 July" style label in the page language. */
export function formatDay(iso: string, options: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'long' }): string {
  const [y, m, d] = iso.split('-').map(Number);
  const text = new Intl.DateTimeFormat(document.documentElement.lang || undefined, { ...options, timeZone: 'UTC' }).format(
    new Date(Date.UTC(y ?? 1970, (m ?? 1) - 1, d ?? 1)),
  );
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function scrollToId(id: string): void {
  const target = document.getElementById(id);
  if (!target) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
}
