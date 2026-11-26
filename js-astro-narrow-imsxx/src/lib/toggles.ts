/** Resolve a page-level toggle against the site default. */
export function resolveToggle(
  value: boolean | { enabled: boolean } | undefined,
  fallback: boolean,
): boolean {
  if (value === undefined) return fallback
  if (typeof value === "boolean") return value
  return value.enabled
}

/** Resolve `license`, where `false` means "hide it on this page". */
export function resolveLicense(
  value: string | boolean | undefined,
  fallback: string,
): string {
  if (value === undefined) return fallback
  if (typeof value === "string") return value
  return value ? fallback : ""
}
