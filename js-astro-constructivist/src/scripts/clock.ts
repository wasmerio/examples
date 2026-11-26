// @env browser
let initialized = false

/** Each clock inherits the configured site zone unless it has its own override. */
export function initClocks(): void {
  const clocks = [
    ...document.querySelectorAll<HTMLTimeElement>('[data-clock]'),
  ]
  if (clocks.length === 0 || initialized)
    return
  initialized = true

  const locale = document.documentElement.lang || 'en'
  const configuredZone = document.documentElement.dataset.timeZone || 'UTC'
  const formatters = clocks.map((clock) => {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: clock.dataset.timeZone || configuredZone,
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
      timeZoneName: 'short',
    }
    try {
      return new Intl.DateTimeFormat(locale, options)
    }
    catch {
      return new Intl.DateTimeFormat('en', { ...options, timeZone: 'UTC' })
    }
  })

  const tick = () => {
    const now = new Date()
    for (const [index, clock] of clocks.entries()) {
      const parts = formatters[index]!.formatToParts(now)
      clock.textContent = parts.filter(part => part.type !== 'timeZoneName').map(part => part.value).join('').trim()
      clock.dateTime = now.toISOString()
      const zone = clock.parentElement?.querySelector('[data-clock-zone]')
      if (zone)
        zone.textContent = parts.find(part => part.type === 'timeZoneName')?.value ?? configuredZone
    }
  }

  tick()
  window.setInterval(tick, 30_000)
}
