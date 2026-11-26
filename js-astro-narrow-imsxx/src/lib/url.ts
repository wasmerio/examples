import { siteConfig } from "../config/site"

/**
 * Prefix an internal path with the deployment base.
 * `base: "/"` (the default) leaves the path untouched.
 */
export function url(path: string): string {
  if (!path.startsWith("/")) return path
  const base = siteConfig.base.replace(/\/+$/, "")
  return `${base}${path}` || "/"
}
