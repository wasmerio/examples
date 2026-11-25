import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

const readTheme = (): Theme => (document.documentElement.classList.contains('dark') ? 'dark' : 'light')

export const useTheme = () => {
  const [theme, setThemeState] = useState<Theme>(() => (typeof document !== 'undefined' ? readTheme() : 'light'))

  useEffect(() => {
    const root = document.documentElement
    const sync = () => setThemeState(readTheme())

    sync()

    const observer = new MutationObserver(sync)

    observer.observe(root, { attributes: true, attributeFilter: ['class'] })

    return () => observer.disconnect()
  }, [])

  const setTheme = (value: Theme) => {
    document.documentElement.classList[value === 'dark' ? 'add' : 'remove']('dark')
    localStorage.setItem('theme', value)
  }

  return { theme, setTheme }
}
