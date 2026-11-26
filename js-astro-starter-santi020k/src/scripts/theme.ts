const themeSelect = document.querySelector<HTMLSelectElement>('#starter-theme')

const modeToggle = document.querySelector<HTMLButtonElement>(
  '[data-starter-mode]'
)

const root = document.documentElement

const families = [
  'lumen',
  'santi020k',
  'studio',
  'paper',
  'field',
  'glass',
  'harbor'
]

const syncModeToggle = () => {
  if (!modeToggle) return

  const family = root.dataset.starterFamily === 'santi020k' ? 'santi020k' : 'lumen'
  const isDark = root.dataset.lumenScheme === 'dark'

  modeToggle.dataset.darkTheme = `${family}-dark`

  modeToggle.dataset.lightTheme = `${family}-light`

  modeToggle.setAttribute('aria-pressed', String(isDark))

  modeToggle.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} mode`)
}

const syncControls = () => {
  if (themeSelect) {
    themeSelect.value = root.dataset.starterFamily ?? 'lumen'

    themeSelect.dispatchEvent(new Event('change'))
  }

  syncModeToggle()
}

const applyTheme = (family: string, mode: string) => {
  root.dataset.starterFamily = family

  root.dataset.lumenScheme = mode

  root.dataset.theme = `${family === 'santi020k' ? family : 'lumen'}-${mode}`

  if (family === 'lumen' || family === 'santi020k')
    delete root.dataset.lumenPreset
  else
    root.dataset.lumenPreset = family === 'harbor' ? 'example-harbor' : family

  root.classList.toggle('dark', mode === 'dark')

  syncModeToggle()

  try {
    localStorage.setItem('lumen-starter-family', family)

    localStorage.setItem('lumen-starter-mode', mode)
  } catch {
    /* Applying a theme does not require persistent storage. */
  }
}

syncControls()

themeSelect?.addEventListener('change', () => {
  if (families.includes(themeSelect.value))
    applyTheme(themeSelect.value, root.dataset.lumenScheme ?? 'light')
})

modeToggle?.addEventListener('click', () => {
  applyTheme(
    root.dataset.starterFamily ?? 'lumen',
    root.dataset.lumenScheme === 'dark' ? 'light' : 'dark'
  )
})
