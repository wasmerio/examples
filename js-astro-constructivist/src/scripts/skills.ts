// @env browser
import { uiText } from './ui'

let initialized = false

/**
 * Category filter for the materials board. All content is rendered by default
 * (works without JS); filtering only hides groups and items, and announces the
 * result through a polite live region.
 */
export function initSkillFilters(): void {
  if (initialized)
    return
  initialized = true

  const buttons = [
    ...document.querySelectorAll<HTMLButtonElement>('[data-skill-filter]'),
  ]
  const groups = [
    ...document.querySelectorAll<HTMLElement>('[data-skill-group]'),
  ]
  const items = [
    ...document.querySelectorAll<HTMLElement>('[data-skill-item]'),
  ]
  const status = document.querySelector<HTMLElement>('[data-skill-status]')

  if (buttons.length === 0 || items.length === 0)
    return

  const apply = (filter: string) => {
    let visible = 0

    for (const item of items) {
      const match = filter === 'all' || item.dataset.category === filter
      item.hidden = !match
      if (match)
        visible += 1
    }

    for (const group of groups) {
      const hasVisible = [
        ...group.querySelectorAll<HTMLElement>('[data-skill-item]'),
      ]
        .some(item => !item.hidden)
      group.hidden = !hasVisible
    }

    for (const button of buttons) {
      button.setAttribute('aria-pressed', String(button.dataset.skillFilter === filter))
    }

    if (status) {
      const label = filter === 'all'
        ? uiText('skills.allCategories')
        : uiText('skills.categoryStatus').replace('{category}', filter)
      status.textContent = uiText('skills.status')
        .replace('{count}', String(visible).padStart(2, '0'))
        .replace('{category}', label)
    }

    document.dispatchEvent(new Event('portfolio:layout'))
  }

  for (const button of buttons) {
    button.addEventListener('click', () => {
      apply(button.dataset.skillFilter ?? 'all')
    })
  }

  apply('all')
}
