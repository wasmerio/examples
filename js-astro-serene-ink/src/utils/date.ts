/**
 * parses a date string in MM/DD/YYYY format and returns a UTC Date object.
 */
export function parseDate(dateStr: string): Date {
    const [m, d, y] = dateStr.split("/");
    return new Date(Date.UTC(Number(y), Number(m) - 1, Number(d)));
}
