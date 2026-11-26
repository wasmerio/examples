const chinese = /^zh(?:-|$)/i.test(document.documentElement.lang)
const copyLabel = chinese ? '复制代码' : 'Copy code'
const copiedLabel = chinese ? '已复制' : 'Copied!'
const manualLabel = chinese ? '请手动复制下方已选中的代码' : 'Copy the selected code manually'

function offerManualCopy(block: HTMLElement, source: string, button: HTMLButtonElement) {
  const label = document.createElement('label')
  label.lang = document.documentElement.lang
  label.className = 'code-copy-fallback'
  label.textContent = manualLabel
  const field = document.createElement('textarea')
  field.readOnly = true
  field.rows = 3
  field.value = source
  label.append(field)
  block.before(label)
  const dismiss = () => label.remove()
  field.addEventListener('blur', dismiss, { once: true })
  field.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return
    event.preventDefault()
    field.removeEventListener('blur', dismiss)
    button.focus({ preventScroll: true })
    dismiss()
  })
  field.focus()
  field.select()
}

const buttons = document.querySelectorAll<HTMLButtonElement>('.astro-code > button.copy')
if (buttons.length) {
  const status = document.createElement('span')
  status.className = 'sr-only'
  status.setAttribute('role', 'status')
  document.body.append(status)

  for (const button of buttons) {
    const block = button.parentElement!
    const code = block.querySelector('pre > code')
    if (!code) continue
    let copying = false
    let timer: number | undefined
    button.lang = document.documentElement.lang
    button.setAttribute('aria-label', copyLabel)
    button.dataset.copiedLabel = copiedLabel
    button.addEventListener('click', async () => {
      if (copying) return
      copying = true
      const source = button.dataset.code ?? code.textContent
      window.clearTimeout(timer)
      status.textContent = ''
      button.classList.remove('copied')
      try {
        await navigator.clipboard.writeText(source)
        button.classList.add('copied')
        status.textContent = copiedLabel
        timer = window.setTimeout(
          () => button.classList.remove('copied'),
          Number(button.dataset.copyTimeout ?? 2000)
        )
      } catch {
        offerManualCopy(block, source, button)
      } finally {
        copying = false
      }
    })
    button.hidden = false
  }
}
