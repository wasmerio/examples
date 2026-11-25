export const dateFields = [
  'date',
  'published',
  'pubDatetime',
  'updated',
  'modDatetime',
  'lastmod',
] as const;

export const dateRule =
  'Use a JavaScript-parseable date string, e.g. "2026-10-16" or "2026-10-16T09:00:00+08:00"; numeric timestamps and other types are not accepted.';

export function validContentDate(value: unknown): value is string {
  return typeof value === 'string' && Number.isFinite(Date.parse(value));
}

export function parseContentDate(value: unknown): Date {
  if (!validContentDate(value))
    throw new Error(`Invalid date: ${JSON.stringify(value)}. ${dateRule}`);
  return new Date(value);
}

/** Validate every supplied alias, including those shadowed by a preferred field. */
export function validateContentDates(
  data: Record<string, unknown>,
  file: string,
  warn: (message: string) => void,
): void {
  const invalid = dateFields.filter(
    (field) => Object.hasOwn(data, field) && !validContentDate(data[field]),
  );
  for (const field of invalid)
    warn(
      `Invalid ${field} in ${file}: ${JSON.stringify(data[field])}. ${dateRule}`,
    );
  if (invalid.length)
    throw new Error(`Invalid content dates in ${file}. ${dateRule}`);
}
