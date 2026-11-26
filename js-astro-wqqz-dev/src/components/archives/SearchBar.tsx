import { type ChangeEvent, useEffect, useRef, useState } from 'react'
import SearchOverlay from './SearchOverlay'
import type { Post } from '../../lib/search'

export type SearchBarProps = {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
  posts?: Post[]
}

export default function SearchBar({
  value = '',
  onChange,
  placeholder = 'Search articles...',
  className = '',
  posts = []
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [shortcutLabel, setShortcutLabel] = useState('Ctrl K')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.userAgent)) {
      setShortcutLabel('⌘ K')
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSelect = (post: Post) => {
    setOpen(false)
    onChange?.(post.title)
    window.location.assign(`/archives/${post.slug}`)
  }

  return (
    <>
      <div className={`relative ${className}`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="16"
          height="16"
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={value ?? ''}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-border/60 bg-muted/30 pl-10 pr-16 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary/80 transition-all"
          aria-label={placeholder}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <kbd className="inline-flex items-center rounded border border-border/80 bg-muted/60 px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
            {shortcutLabel}
          </kbd>
        </div>
      </div>
      <SearchOverlay
        open={open}
        posts={posts}
        initialQuery={value ?? ''}
        onQueryChange={onChange}
        onClose={() => setOpen(false)}
        onSelect={handleSelect}
      />
    </>
  )
}
