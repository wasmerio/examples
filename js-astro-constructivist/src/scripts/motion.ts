// @env browser
let initialized = false

function initExpanders(): void {
  for (const expander of document.querySelectorAll<HTMLElement>('[data-expander]')) {
    const toggle = expander.querySelector<HTMLButtonElement>('.expander__toggle')
    const body = expander.querySelector<HTMLElement>('.expander__body')
    if (!toggle || !body)
      continue

    const setCollapsed = (collapsed: boolean) => {
      expander.toggleAttribute('data-collapsed', collapsed)
      toggle.setAttribute('aria-expanded', String(!collapsed))
      body.toggleAttribute('inert', collapsed)
      body.setAttribute('aria-hidden', String(collapsed))
    }

    // Establish the initial geometry before anchor navigation measures the page.
    const transition = body.style.transition
    body.style.transition = 'none'
    setCollapsed(true)
    body.getBoundingClientRect()
    body.style.transition = transition
    toggle.addEventListener('click', () => {
      setCollapsed(!expander.hasAttribute('data-collapsed'))
      document.dispatchEvent(new Event('portfolio:layout'))
    })
  }
}

function initPrintButtons(): void {
  const root = document.documentElement
  const posterPage = document.createElement('style')
  posterPage.id = 'poster-page'
  posterPage.textContent = '@media print { @page { size: A4 portrait; margin: 0; } }'

  const setMode = (mode: string | undefined) => {
    if (mode)
      root.dataset.printMode = mode
    else
      delete root.dataset.printMode

    if (mode === 'poster')
      document.head.append(posterPage)
    else
      posterPage.remove()
  }

  const closeDialogs = () => {
    // Modal top layers can suppress or cover the document in print output.
    for (const dialog of document.querySelectorAll<HTMLDialogElement>('dialog[open]'))
      dialog.close()
  }

  for (const button of document.querySelectorAll<HTMLElement>('[data-print]')) {
    button.addEventListener('click', () => {
      closeDialogs()
      setMode(button.dataset.printMode)
      window.print()
    })
  }

  window.addEventListener('beforeprint', closeDialogs)
  window.addEventListener('afterprint', () => setMode(undefined))
}

function initMagnetic(): void {
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
  if (!finePointer)
    return

  for (const element of document.querySelectorAll<HTMLElement>('[data-magnetic]')) {
    const strength = Number(element.dataset.magnetic) || 0.12
    element.addEventListener('pointermove', (event) => {
      if (reduced.matches)
        return
      const rect = element.getBoundingClientRect()
      const x = (event.clientX - rect.left - rect.width / 2) * strength
      const y = (event.clientY - rect.top - rect.height / 2) * strength
      element.style.translate = `${x.toFixed(2)}px ${y.toFixed(2)}px`
    }, { passive: true })
    element.addEventListener('pointerleave', () => {
      element.style.translate = ''
    })
    reduced.addEventListener('change', () => {
      element.style.translate = ''
    })
  }
}

export function initMotion(): void {
  if (initialized)
    return
  initialized = true
  initExpanders()
  initPrintButtons()
  initMagnetic()
}
