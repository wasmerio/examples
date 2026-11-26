// @env browser
import { uiText } from './ui'

let initialized = false

interface CommandIndex {
  activeIndex: number
  dialog: HTMLDialogElement
  empty: HTMLElement
  groups: HTMLElement[]
  input: HTMLInputElement
  items: HTMLLIElement[]
  nav: HTMLElement
  results: HTMLElement
  status: HTMLElement
  visible: HTMLLIElement[]
}

/**
 * Command index inside the native <dialog>. The server renders every result
 * grouped by type from the CV dataset; this module filters those links
 * case-insensitively, keeps the seven-plate nav for an empty query and moves
 * the active result with the arrow keys. Escape and focus trapping stay native.
 */
export function initCommandSearch(): void {
  if (initialized)
    return
  initialized = true

  const index = connect()
  if (!index)
    return

  index.input.addEventListener('input', () => apply(index, index.input.value))

  index.results.addEventListener('click', (event) => {
    const target = event.target
    if (target instanceof Element && target.closest('[data-command-result]'))
      index.dialog.close()
  })

  index.dialog.addEventListener('keydown', event => handleResultKeys(index, event))
  index.dialog.addEventListener('close', () => {
    if (index.dialog.open)
      return
    index.input.value = ''
    apply(index, '')
  })
  document.addEventListener('keydown', event => handleShortcut(index, event))
}

function connect(): CommandIndex | null {
  const dialog = document.getElementById('indexDialog') as HTMLDialogElement | null
  const input = dialog?.querySelector<HTMLInputElement>('[data-command-input]')
  const nav = dialog?.querySelector<HTMLElement>('[data-command-nav]')
  const results = dialog?.querySelector<HTMLElement>('[data-command-results]')
  const status = dialog?.querySelector<HTMLElement>('[data-command-status]')
  const empty = results?.querySelector<HTMLElement>('[data-command-empty]')

  if (!dialog || !input || !nav || !results || !status || !empty)
    return null

  const items = [
    ...results.querySelectorAll<HTMLLIElement>('[data-command-item]'),
  ]
  const groups = [
    ...results.querySelectorAll<HTMLElement>('[data-command-group]'),
  ]

  if (items.length === 0)
    return null

  return {
    activeIndex: -1,
    dialog,
    empty,
    groups,
    input,
    items,
    nav,
    results,
    status,
    visible: [],
  }
}

function describe(index: CommandIndex): void {
  if (index.visible.length === 0) {
    index.status.textContent = uiText('index.noResults')
    return
  }

  const count = `${index.visible.length} ${index.visible.length === 1
    ? uiText('index.result')
    : uiText('index.results')}`
  const label = index.visible[index.activeIndex]?.querySelector('.index-dialog__hit-label')?.textContent

  index.status.textContent = label
    ? `${count} · ${label}`
    : count
}

function clearActive(index: CommandIndex): void {
  for (const item of index.items)
    item.classList.remove('is-active')
  index.activeIndex = -1
}

function setActive(index: CommandIndex, next: number): void {
  clearActive(index)
  index.activeIndex = next

  const active = index.visible[next]
  if (!active)
    return describe(index)

  active.classList.add('is-active')
  active.scrollIntoView({ block: 'nearest' })
  describe(index)
}

function filterItems(index: CommandIndex, term: string): void {
  for (const item of index.items)
    item.hidden = !(item.dataset.commandSearch ?? '').includes(term)

  index.visible = index.items.filter(item => !item.hidden)

  for (const group of index.groups)
    group.hidden = !group.querySelector('[data-command-item]:not([hidden])')

  index.empty.hidden = index.visible.length > 0
  setActive(index, index.visible.length > 0
    ? 0
    : -1)
}

function resetItems(index: CommandIndex): void {
  for (const item of index.items)
    item.hidden = false
  for (const group of index.groups)
    group.hidden = false

  index.visible = []
  clearActive(index)
  index.status.textContent = ''
  index.empty.hidden = true
}

function apply(index: CommandIndex, query: string): void {
  const term = query.trim().toLowerCase()
  const searching = term.length > 0

  index.nav.hidden = searching
  index.results.hidden = !searching

  if (searching)
    filterItems(index, term)
  else
    resetItems(index)
}

function openDialog(index: CommandIndex): void {
  if (!index.dialog.open || index.dialog.dataset.menuState === 'closing') {
    const trigger = document.querySelector<HTMLElement>('[data-index-open]')

    if (trigger) {
      trigger.click()
    }
    else {
      index.dialog.showModal()
      document.documentElement.classList.add('index-open')
    }
  }

  if (index.dialog.open)
    index.input.focus({ preventScroll: true })
}

function moveActive(index: CommandIndex, step: number): void {
  const from = index.activeIndex < 0
    ? (step === 1
        ? -1
        : index.visible.length)
    : index.activeIndex
  const next = Math.min(Math.max(from + step, 0), index.visible.length - 1)
  const focused = document.activeElement instanceof HTMLElement
    && document.activeElement.matches('[data-command-result]')

  setActive(index, next)

  if (!focused)
    return

  const link = index.visible[next]?.firstElementChild
  if (link instanceof HTMLElement)
    link.focus()
}

function followActive(index: CommandIndex): void {
  const target = index.visible[index.activeIndex] ?? index.visible[0]
  const link = target?.firstElementChild

  if (link instanceof HTMLElement)
    link.click()
}

function handleResultKeys(index: CommandIndex, event: KeyboardEvent): void {
  if (index.results.hidden)
    return

  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    if (index.visible.length === 0)
      return

    event.preventDefault()
    moveActive(index, event.key === 'ArrowDown'
      ? 1
      : -1)
    return
  }

  if (event.key === 'Enter' && !event.isComposing && document.activeElement === index.input) {
    const target = index.visible[index.activeIndex] ?? index.visible[0]

    if (!(target?.firstElementChild instanceof HTMLElement))
      return

    event.preventDefault()
    followActive(index)
  }
}

function handleShortcut(index: CommandIndex, event: KeyboardEvent): void {
  if (event.defaultPrevented || event.altKey)
    return

  const typing = event.target instanceof HTMLElement
    && (event.target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName))
  const command = (event.metaKey || event.ctrlKey)
    && !event.shiftKey
    && event.key.toLowerCase() === 'k'
  const slash = event.key === '/'
    && !event.metaKey
    && !event.ctrlKey
    && !typing

  if (!command && !slash)
    return

  event.preventDefault()
  openDialog(index)
}
