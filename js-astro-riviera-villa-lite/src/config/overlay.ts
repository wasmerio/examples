import type { VillaInput } from './schema.ts';

/**
 * Demo overlay: values that only the hosted demo uses (its legal notice link, its sample
 * calendars). It lives in demo/villa.demo.ts, which is not part of the theme package, so a
 * buyer's build never sees it.
 */
export type DeepPartial<T> = T extends readonly unknown[]
  ? T
  : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T;

export type VillaOverlay = DeepPartial<VillaInput>;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/** Deep merge: objects are merged key by key, arrays and plain values are replaced. */
export function applyOverlay<T>(base: T, overlay: unknown): T {
  if (!isPlainObject(base) || !isPlainObject(overlay)) return (overlay === undefined ? base : overlay) as T;
  const out: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(overlay)) {
    out[key] = applyOverlay(out[key], value);
  }
  return out as T;
}
