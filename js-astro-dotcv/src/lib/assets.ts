export function resolveAsset(pathStr?: string | null): string {
  if (!pathStr) return "";
  if (
    pathStr.startsWith("http://") ||
    pathStr.startsWith("https://") ||
    pathStr.startsWith("data:")
  ) {
    return pathStr;
  }
  const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
  const cleanPath = pathStr.replace(/^\//, "");
  return base ? `${base}/${cleanPath}` : `/${cleanPath}`;
}
