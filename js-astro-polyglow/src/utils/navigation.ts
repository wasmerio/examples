export function getPrimaryNavigationKey(path: string): string | undefined {
  const category = path.match(/^\/category\/([^/]+)\/(?:\d+\/)?$/)
  if (category) return category[1]
  if (/^\/posts\/(?:\d+\/)?$/.test(path)) return "posts"
  return undefined
}
