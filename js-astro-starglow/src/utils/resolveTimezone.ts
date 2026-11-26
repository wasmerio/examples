const warned = new Set<string>();
const valid = new Map<string, boolean>();

/**
 * `zone` if this runtime knows it, else UTC with one warning per bad value.
 * `dayjs().tz()` throws a `RangeError` on an unknown name, which would abort
 * the build.
 */
export function resolveTimezone(zone: string | undefined): string {
  if (!zone) return "UTC";

  let ok = valid.get(zone);
  if (ok === undefined) {
    try {
      new Intl.DateTimeFormat("en-US", { timeZone: zone });
      ok = true;
    } catch {
      ok = false;
    }
    valid.set(zone, ok);
  }
  if (ok) return zone;

  if (!warned.has(zone)) {
    warned.add(zone);
    // eslint-disable-next-line no-console
    console.warn(
      `[starglow] Unknown timezone "${zone}". Falling back to UTC. ` +
        `Use an IANA name such as "Asia/Bangkok" or "America/New_York".`
    );
  }
  return "UTC";
}
