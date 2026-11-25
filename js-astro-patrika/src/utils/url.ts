const base = import.meta.env.BASE_URL.replace(/\/+$/, "");
const baseRoot = base === "" ? "/" : `${base}/`;

function isExternal(path: string): boolean {
  return /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(path);
}

export function getAssetPath(path: string): string {
  if (isExternal(path)) return path;

  const normalized = path.replace(/^\/+/, "");

  return normalized ? `${baseRoot}${normalized}` : baseRoot;
}

export function absoluteUrl(
  path: string,
  site?: string | URL
): string {
  return new URL(getAssetPath(path), site).toString();
}

/**
 * OG image path for a given route, mirroring src/pages/og/[...path].png.ts's
 * getStaticPaths 1:1 — the homepage's activePath ("/") maps to /og/home.png.
 */
export function getOgImagePath(activePath: string): string {
  const normalized = activePath.replace(/\/+$/, "");
  return normalized === "" ? "/og/home.png" : `/og${normalized}.png`;
}