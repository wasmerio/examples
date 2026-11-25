import type { ComponentProps } from 'react'

// SVG Imports
import SunIcon from '@/assets/svg/sun'
import MoonIcon from '@/assets/svg/moon'

import { useTheme } from '@/hooks/use-theme'
import { cn } from '@/lib/utils'

type ThemeToggleProps = ComponentProps<'button'>

const ThemeToggle = ({ className, children, ...props }: ThemeToggleProps) => {
  const { theme, setTheme } = useTheme()

  return (
    <button
      type='button'
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className={cn('flex items-center', className)}
      {...props}
    >
      <span className='relative flex size-4 shrink-0 items-center justify-center'>
        <MoonIcon className='size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90' />
        <SunIcon className='absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0' />
      </span>
      {children}
      <span className='sr-only'>Toggle theme</span>
    </button>
  )
}

export default ThemeToggle
