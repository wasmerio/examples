import { DEFAULT_CONFIGURATION } from './constants';

export const formatDate = (date: Date) => {
  const formatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC', // Default to UTC to prevent timezone issues
  });

  // Ensure we're parsing the date correctly
  return formatter.format(new Date(date));
};

export const generateAbsoluteUrl = (path: string) =>
  DEFAULT_CONFIGURATION.baseUrl.concat(path);

export const isDevelopment = () => import.meta.env.MODE === 'development';

export const includeDraft = (draft: boolean) => {
  if (isDevelopment()) return true;
  return draft !== true;
};

/*
 * Generic function for sorting items with start and optional end years
 * - Items without an end year are considered ongoing and are sorted accordingly
 * - Items are sorted by end year descending, then by start year descending
 * - If end year is not present, current year is used for comparison
 */
export const sortByDateRange = <
  T extends { data: { from: number; to?: number } },
>(
  items: T[],
) => {
  const getCurrentYear = () => new Date().getFullYear();

  return items.sort((current, next) => {
    // Prioritize ongoing jobs (no 'to' field) first
    const currentIsOngoing = current.data.to === undefined;
    const nextIsOngoing = next.data.to === undefined;

    // If one is ongoing and the other isn't, ongoing comes first
    if (currentIsOngoing && !nextIsOngoing) return -1;
    if (!currentIsOngoing && nextIsOngoing) return 1;

    // If both are ongoing or both have end dates, sort by end year then start year
    const currentEnd = current.data.to ?? getCurrentYear();
    const nextEnd = next.data.to ?? getCurrentYear();
    return nextEnd - currentEnd || next.data.from - current.data.from;
  });
};

/*
 * Generic function for sorting items by year in descending order
 * - Items are sorted by year descending
 */
export const sortByYear = <T extends { data: { year: number } }>(
  items: T[],
) => {
  return items.sort((a, b) => b.data.year - a.data.year);
};
