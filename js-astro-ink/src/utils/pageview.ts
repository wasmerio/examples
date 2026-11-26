/** Decode the existing numeric counter and Waline's time/views response shapes. */
function readViews(payload: unknown): number | null {
  let count: unknown = payload
  if (typeof payload === 'object' && payload !== null) {
    const result = payload as { errno?: unknown; data?: unknown }
    if (result.errno !== undefined && result.errno !== 0) return null
    const first = Array.isArray(result.data) ? result.data[0] : undefined
    count = first?.time ?? first?.views
  }
  return typeof count === 'number' && Number.isSafeInteger(count) && count >= 0 ? count : null
}

/** Record one visit. Do not retry ambiguous failures that may already have counted it. */
export async function recordPageview(
  server: string,
  path: string,
  request: typeof fetch = fetch
): Promise<number | null> {
  const base = server.trim().replace(/\/+$/, '')
  if (!base || !path) return null
  try {
    let response = await request(`${base}/article`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, type: 'time', action: 'inc' })
    })
    // Some older/custom servers expose only a GET counter. Include the exact path.
    if (response.status === 405 || response.status === 501) {
      const query = new URLSearchParams({ path, type: 'time' })
      response = await request(`${base}/article?${query}`, { method: 'GET' })
    }
    if (!response.ok) return null
    return readViews(await response.json())
  } catch {
    return null
  }
}

/** Shared display behavior for article and site-wide counters. */
export async function updatePageview(element: HTMLElement | null): Promise<void> {
  if (!element || element.dataset.pageviewState) return
  const number = element.querySelector<HTMLElement>('[data-pageview-value]')
  if (!number) return
  element.dataset.pageviewState = 'loading'
  const label = number.getAttribute('aria-label') || 'views'
  const count = await recordPageview(element.dataset.server || '', element.dataset.path || '')
  if (!element.isConnected) return
  element.dataset.pageviewState = count === null ? 'error' : 'loaded'
  number.textContent = count === null ? '—' : count.toLocaleString()
  number.setAttribute('aria-label', count === null ? `${label}: unavailable` : `${label}: ${count}`)
  if (count === null) number.title = 'View count temporarily unavailable'
}
