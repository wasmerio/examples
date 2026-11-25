import * as React from 'react'
import { MoonStarIcon, SunIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

function ThemeToggle() {
  const [theme, setTheme] = React.useState<'light' | 'dark'>(() => {
    // Read initial theme from localStorage first, then DOM
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme')

      if (stored === 'light' || stored === 'dark') {
        return stored
      }

      return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
    }

    return 'light'
  })

  // Update theme class and localStorage when theme changes
  React.useEffect(() => {
    document.documentElement.classList[theme === 'dark' ? 'add' : 'remove']('dark')

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('theme', theme)
    }
  }, [theme])

  return (
    <Button
      variant='outline'
      size='icon'
      className='relative'
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      <MoonStarIcon className='size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90' />
      <SunIcon className='absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0' />
      <span className='sr-only'>Toggle theme</span>
    </Button>
  )
}

export default ThemeToggle
