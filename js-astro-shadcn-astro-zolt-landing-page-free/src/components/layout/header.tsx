import { COMPANY_INFO } from '@/consts'
import ThemeToggle from '@/components/layout/theme-toggle'

// Navigation configuration
const ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Features', href: '#features' },
  { label: 'Blog', href: '/blog' },
  { label: 'Login', href: '/login' },
  { label: 'Register', href: '/register' }
]

export const Header = () => {
  return (
    <header className='sticky top-0 z-50 w-full border-b bg-gray-50 dark:bg-gray-900' role='banner'>
      <div className='container mx-auto flex items-center justify-between px-4 py-6'>
        <a href='/' className='flex items-center gap-2 text-2xl font-bold' aria-label={`${COMPANY_INFO.name} Home`}>
          <img
            src={COMPANY_INFO.logo}
            alt={`${COMPANY_INFO.name} Logo`}
            width={25}
            height={25}
            className='dark:invert'
          />
          <span>{COMPANY_INFO.name}</span>
        </a>
        <nav aria-label='Primary navigation' className='flex items-center gap-6'>
          <ThemeToggle />
          <ul className='flex gap-6'>
            {ITEMS.map(item => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className='text-muted-foreground hover:text-foreground text-base font-medium transition-colors'
                  aria-label={`Navigate to ${item.label}`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
