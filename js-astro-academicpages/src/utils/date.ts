import { siteConfig } from '@data/siteConfig';

const defaultDateFormatter = new Intl.DateTimeFormat(siteConfig.locale, {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC',
});

const defaultYearFormatter = new Intl.DateTimeFormat(siteConfig.locale, {
  year: 'numeric',
  timeZone: 'UTC',
});

function toValidDate(
  date: Date | string | number | undefined
): Date | undefined {
  if (!date) return undefined;
  const d = date instanceof Date ? date : new Date(date);

  return isNaN(d.getTime()) ? undefined : d;
}

/**
 * Formats a date into a localized date string using siteConfig.locale and UTC timezone
 */
export function formatDate(
  date: Date | string | number | undefined,
  options?: Intl.DateTimeFormatOptions
): string | undefined {
  const d = toValidDate(date);
  if (!d) return undefined;

  if (options) {
    return new Intl.DateTimeFormat(siteConfig.locale, {
      timeZone: 'UTC',
      ...options,
    }).format(d);
  }

  return defaultDateFormatter.format(d);
}

/**
 * Formats a date into a localized 4-digit year string using siteConfig.locale and UTC timezone
 */
export function formatYear(
  date: Date | string | number | undefined
): string | undefined {
  const d = toValidDate(date);
  if (!d) return undefined;

  return defaultYearFormatter.format(d);
}

/**
 * Converts a date to an ISO date string (YYYY-MM-DD)
 */
export function toIsoDateString(
  date: Date | string | number | undefined
): string | undefined {
  const d = toValidDate(date);
  if (!d) return undefined;

  return d.toISOString().split('T')[0];
}

const semesterOrder: Record<string, number> = {
  Winter: 4,
  Autumn: 3,
  Fall: 3,
  Summer: 2,
  Spring: 1,
};

/**
 * Computes a numeric sort weight for teaching entries using year and semester
 */
export function getTeachingSortWeight(item: {
  data: { year: number; semester: string };
}): number {
  const semWeight = semesterOrder[item.data.semester] ?? 0;

  return item.data.year * 10 + semWeight;
}

/**
 * Sorts teaching items in reverse chronological order (newest year and semester first)
 */
export function sortTeaching<
  T extends { data: { year: number; semester: string } },
>(items: T[]): T[] {
  return items.sort(
    (a, b) => getTeachingSortWeight(b) - getTeachingSortWeight(a)
  );
}

/**
 * Sorts collection items with a date field in reverse chronological order (newest first)
 */
export function sortByDateDesc<
  T extends { data: { date: Date | string | number } },
>(items: T[]): T[] {
  return items.sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
  );
}
