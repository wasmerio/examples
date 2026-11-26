// @env browser
import { uiText } from './ui'

let initialized = false

export function initCopyEmail(): void {
  if (initialized)
    return
  initialized = true

  for (const button of document.querySelectorAll<HTMLButtonElement>('[data-copy-email]')) {
    const email = button.dataset.copyEmail
    const label = button.querySelector<HTMLElement>('[data-copy-label]')
    if (!email || !label)
      continue

    label.setAttribute('role', 'status')
    let reset = 0
    button.addEventListener('click', async () => {
      window.clearTimeout(reset)
      try {
        await navigator.clipboard.writeText(email)
        label.textContent = uiText('contact.copied')
        reset = window.setTimeout(() => {
          label.textContent = uiText('common.copy')
        }, 2200)
      }
      catch {
        const address = button.parentElement?.querySelector<HTMLAnchorElement>('a[href^="mailto:"]')
        const selection = window.getSelection()
        if (address && selection) {
          selection.selectAllChildren(address)
          label.textContent = uiText('contact.selected')
        }
        else {
          label.textContent = uiText('contact.copyManually')
        }
      }
    })
  }
}
