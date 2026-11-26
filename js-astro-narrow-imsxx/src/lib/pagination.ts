import { url } from "./url"
export function pageUrl(base: string, page: number): string {
  const clean = base.replace(/\/+$/, "")
  const path = page <= 1 ? `${clean}/` : `${clean}/page/${page}/`
  return url(path)
}

export type Paginated<T> = {
  items: T[]
  current: number
  totalPages: number
  total: number
  prev: string | null
  next: string | null
}

export function paginate<T>(
  items: T[],
  current: number,
  pageSize: number,
  base: string,
): Paginated<T> {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))
  const page = Math.min(Math.max(1, current), totalPages)
  const start = (page - 1) * pageSize
  return {
    items: items.slice(start, start + pageSize),
    current: page,
    totalPages,
    total: items.length,
    prev: page > 1 ? pageUrl(base, page - 1) : null,
    next: page < totalPages ? pageUrl(base, page + 1) : null,
  }
}

/** Page numbers to render, with null standing for an ellipsis. */
export function pageWindow(
  current: number,
  totalPages: number,
): (number | null)[] {
  if (totalPages <= 1) return []
  const pages = new Set<number>()
  for (let i = current - 2; i <= current + 2; i += 1) {
    if (i >= 1 && i <= totalPages) pages.add(i)
  }
  if (current > 3) pages.add(1)
  if (current < totalPages - 2) pages.add(totalPages)

  const sorted = [...pages].sort((a, b) => a - b)
  const result: (number | null)[] = []
  let previous = 0
  for (const page of sorted) {
    if (previous && page - previous > 1) result.push(null)
    result.push(page)
    previous = page
  }
  return result
}
