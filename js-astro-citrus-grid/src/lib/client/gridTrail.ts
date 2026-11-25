const GRID_CELL = 28

export function initGridTrail() {
  const w = window as unknown as { __gridTrailBound?: boolean }
  if (w.__gridTrailBound) return
  w.__gridTrailBound = true

  const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  let trailEl: HTMLElement | null = null
  let lastCol = -1
  let lastRow = -1

  const spawnTrailCell = (col: number, row: number) => {
    trailEl ??= document.getElementById('grid-trail')
    if (!trailEl) return
    const cell = document.createElement('span')
    cell.className = 'grid-trail-cell'
    cell.style.left = `${col * GRID_CELL}px`
    cell.style.top = `${row * GRID_CELL}px`
    cell.addEventListener('animationend', () => cell.remove(), { once: true })
    trailEl.appendChild(cell)
    if (trailEl.childElementCount > 160) trailEl.firstElementChild?.remove()
  }

  window.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType !== 'mouse' || reduceMotionQuery.matches) return
      const col = Math.floor(e.clientX / GRID_CELL)
      const row = Math.floor(e.clientY / GRID_CELL)
      if (col === lastCol && row === lastRow) return
      if (lastCol < 0) {
        spawnTrailCell(col, row)
      } else {
        const steps = Math.max(Math.abs(col - lastCol), Math.abs(row - lastRow))
        for (let i = 1; i <= steps; i++) {
          spawnTrailCell(
            Math.round(lastCol + ((col - lastCol) * i) / steps),
            Math.round(lastRow + ((row - lastRow) * i) / steps),
          )
        }
      }
      lastCol = col
      lastRow = row
    },
    { passive: true },
  )

  document.addEventListener('pointerleave', () => {
    lastCol = -1
    lastRow = -1
  })
}
