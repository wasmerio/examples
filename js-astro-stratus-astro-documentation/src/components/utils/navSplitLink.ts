const SPLIT_PATH_PREFIXES = ["/", "http://", "https://", "mailto:", "tel:"] as const;

/** Placeholders such as `#` count as no link, so the whole row stays one toggle. */
export function itemHasSplitNavLink(item: { path?: unknown }): boolean {
  const raw = item?.path;
  const p = typeof raw === "string" ? raw.trim() : "";

  if (!p || p === "#") return false;
  return SPLIT_PATH_PREFIXES.some((prefix) => p.startsWith(prefix));
}
