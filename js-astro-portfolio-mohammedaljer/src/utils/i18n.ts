// SPDX-License-Identifier: MIT

/**
 * Returns a locale-prefixed path.
 * English (default) has no prefix; German gets /de prefix.
 */
export function localePath(path: string, locale: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (locale === "de") {
    return clean === "/" ? "/de/" : `/de${clean}`;
  }
  return clean;
}

/**
 * Returns the alternate locale URL path for the given path.
 */
export function getAlternatePath(currentPath: string): { path: string; locale: string } {
  if (currentPath.startsWith("/de/") || currentPath === "/de") {
    return { path: currentPath.replace(/^\/de/, "") || "/", locale: "en" };
  }
  return { path: currentPath === "/" ? "/de/" : `/de${currentPath}`, locale: "de" };
}
