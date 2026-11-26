/** Format a date for display, e.g. "October 8, 2026". */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en', { dateStyle: 'long' }).format(date);
}
