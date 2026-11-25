// 轻量 UI 工具：toast
let toastEl: HTMLElement | null = null
let toastTimer = 0

export function toast(message: string, type: 'info' | 'error' = 'info') {
  if (!toastEl) {
    toastEl = document.createElement('div')
    toastEl.className = 'cms-toast'
    document.body.append(toastEl)
  }
  toastEl.textContent = message
  toastEl.dataset.type = type
  toastEl.classList.add('show')
  clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => toastEl?.classList.remove('show'), 2400)
}
