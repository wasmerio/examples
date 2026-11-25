/**
 * Formats a Date object to a string based on the specified locales and options.
 *
 * @param date - The Date object to format.
 * @param locales - A string representing the locales to use; defaults to 'en'.
 * @param options - An Intl.DateTimeFormatOptions object defining formatting behavior; defaults to an object with year, month, and day.
 * @returns A formatted date string with slashes replaced by ' - '.
 */
export function formatDate(
  date: Date,
  locales: string = "en",
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  },
) {
  return date.toLocaleDateString(locales, options).replaceAll("/", " - ");
}
