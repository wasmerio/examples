/**
 * The booked nights shared by the calendar and the booking form, kept in the
 * <script type="application/json" data-availability> element of the page.
 * The calendar writes fresher dates there; the form reads them before each check.
 */
export interface AvailabilityPayload {
  generatedAt: string;
  /** Booked nights: [first night, departure day (excluded)], YYYY-MM-DD. */
  busy: [string, string][];
}

interface TextHolder {
  textContent: string | null;
}

const ISO = /^\d{4}-\d{2}-\d{2}$/;

export function isPayload(value: unknown): value is AvailabilityPayload {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.generatedAt === 'string' &&
    Array.isArray(v.busy) &&
    v.busy.every((r) => Array.isArray(r) && ISO.test(String(r[0])) && ISO.test(String(r[1])))
  );
}

export function readStore(holder: TextHolder | null): AvailabilityPayload | null {
  if (!holder?.textContent) return null;
  try {
    const data: unknown = JSON.parse(holder.textContent);
    return isPayload(data) ? data : null;
  } catch {
    return null;
  }
}

export function writeStore(holder: TextHolder, data: AvailabilityPayload): void {
  holder.textContent = JSON.stringify({ generatedAt: data.generatedAt, busy: data.busy });
}

