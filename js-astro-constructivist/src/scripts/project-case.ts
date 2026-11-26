// @env browser
let initialized = false

interface CaseViewer {
  dialog: HTMLDialogElement
  panels: HTMLElement[]
  scroller: HTMLElement | null
}

let viewer: CaseViewer | null = null
let activeIndex = 0
let lastTrigger: HTMLElement | null = null

function paint(index: number, focusTitle: boolean): void {
  if (!viewer)
    return

  const { dialog, panels, scroller } = viewer
  if (panels.length === 0)
    return

  activeIndex = (index + panels.length) % panels.length
  const active = panels[activeIndex]
  if (!active)
    return

  for (const panel of panels)
    panel.hidden = panel !== active

  const title = active.querySelector<HTMLElement>('[data-case-title]')
  if (title?.id)
    dialog.setAttribute('aria-labelledby', title.id)

  if (scroller)
    scroller.scrollTop = 0

  if (focusTitle)
    title?.focus({ preventScroll: true })
}

function close(): void {
  if (!viewer?.dialog.open)
    return

  viewer.dialog.close()
}

function open(trigger: HTMLElement, index: number): void {
  if (!viewer)
    return

  lastTrigger = trigger
  paint(index, false)

  if (viewer.dialog.open)
    return

  viewer.dialog.showModal()
  document.documentElement.classList.add('case-open')
}

export function initProjectCase(): void {
  if (initialized)
    return
  initialized = true

  const dialog = document.getElementById('projectCase')
  if (!(dialog instanceof HTMLDialogElement))
    return

  const panels = [
    ...dialog.querySelectorAll<HTMLElement>('[data-case-panel]'),
  ]
  if (panels.length === 0)
    return

  viewer = {
    dialog,
    panels,
    scroller: dialog.querySelector<HTMLElement>('[data-case-scroll]'),
  }

  document.addEventListener('click', (event) => {
    const target = event.target as Element | null
    if (!target)
      return

    const trigger = target.closest<HTMLElement>('[data-case-open]')
    if (trigger) {
      const index = Number.parseInt(trigger.dataset.caseIndex ?? '', 10)
      open(trigger, Number.isNaN(index)
        ? 0
        : index)
      return
    }

    if (!dialog.open)
      return

    if (target.closest('[data-case-close]')) {
      close()
      return
    }

    if (target.closest('[data-case-prev]')) {
      paint(activeIndex - 1, true)
      return
    }

    if (target.closest('[data-case-next]')) {
      paint(activeIndex + 1, true)
      return
    }

    if (target === dialog)
      close()
  })

  dialog.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')
      return
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)
      return

    const target = event.target as HTMLElement | null
    if (target?.closest('input, textarea, select, [contenteditable="true"]'))
      return

    event.preventDefault()
    paint(activeIndex + (event.key === 'ArrowRight'
      ? 1
      : -1), true)
  })

  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('case-open')
    lastTrigger?.focus({ preventScroll: true })
  })
}
