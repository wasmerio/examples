// @env browser
let initialized = false

interface SectionDetail {
  index: string
  label: string
  progress: number
}

export function initSceneHud(): void {
  const hud = document.querySelector<HTMLElement>('.scene-hud')
  const index = hud?.querySelector<HTMLElement>('[data-scene-index]')
  const label = hud?.querySelector<HTMLElement>('[data-scene-label]')
  const fill = hud?.querySelector<HTMLElement>('[data-scene-fill]')
  const count = hud?.querySelector<HTMLElement>('[data-scene-count]')
  if (!hud || !index || !label || !fill || !count || initialized)
    return
  initialized = true

  document.addEventListener('portfolio:section', (event) => {
    const detail = (event as CustomEvent<SectionDetail>).detail
    index.textContent = detail.index
    label.textContent = detail.label
    count.textContent = `${detail.index} / ${hud.dataset.sectionTotal ?? '00'}`
    fill.style.transform = `scaleX(${detail.progress.toFixed(4)})`
  })
}
