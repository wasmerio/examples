import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { searchPosts, type Post } from '../../lib/search'

export type SearchOverlayProps = {
  open: boolean
  posts?: Post[]
  initialQuery?: string
  onQueryChange?: (value: string) => void
  onClose: () => void
  onSelect: (post: Post) => void
}

function formatDisplayDate(dateStr?: string): string {
  if (!dateStr) return ''
  try {
    const date = new Date(dateStr)
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'UTC',
      })
    }
  } catch {
  }
  return dateStr
}

function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex items-center rounded border border-border/80 bg-card/60 px-1.5 py-0.5 font-mono text-[10px] leading-none text-muted-foreground">
      {children}
    </kbd>
  )
}

export default function SearchOverlay({
  open,
  posts = [],
  initialQuery = '',
  onQueryChange,
  onClose,
  onSelect,
}: SearchOverlayProps) {
  const [query, setQuery] = useState(initialQuery ?? '')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const initialQueryRef = useRef(initialQuery)
  useEffect(() => {
    initialQueryRef.current = initialQuery
  }, [initialQuery])

  const results = useMemo(() => searchPosts(posts || [], query || ''), [posts, query])

  useEffect(() => {
    if (!open) return
    setQuery(initialQueryRef.current ?? '')
    setActiveIndex(0)
    requestAnimationFrame(() => inputRef.current?.focus())
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    setActiveIndex((i) => (results.length === 0 ? 0 : Math.min(i, results.length - 1)))
  }, [open, results.length])

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (results.length === 0) return
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex((i) => (i + 1) % results.length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex((i) => (i - 1 + results.length) % results.length)
      } else if (e.key === 'Enter') {
        e.preventDefault()
        const post = results[activeIndex]
        if (post) onSelect(post)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, results, activeIndex, onClose, onSelect])

  useEffect(() => {
    listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex, open])

  if (!open) return null

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search articles"
      className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/40 px-4 pb-10 pt-[14vh] backdrop-blur-sm dark:bg-black/60"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="w-full max-w-xl overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-2xl">
        <div className="flex items-center gap-3 border-b border-border px-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="16"
            height="16"
            className="shrink-0 text-muted-foreground"
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
            value={query}
            onChange={(e) => {
              const next = e.target.value
              setQuery(next)
              onQueryChange?.(next)
            }}
            placeholder="Search articles..."
            aria-label="Search articles"
            className="w-full bg-transparent py-3.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
          />
          <Kbd>esc</Kbd>
        </div>

        <div ref={listRef} className="max-h-[46vh] overflow-y-auto py-1.5">
          {results.length === 0 ? (
            <div className="px-4 py-12 text-center text-sm text-muted-foreground" aria-live="polite">
              No matching articles found{query.trim() ? ` for "${query.trim()}"` : ''}.
            </div>
          ) : (
            results.map((post, idx) => {
              const active = idx === activeIndex
              return (
                <a
                  key={post.slug}
                  href={`/archives/${post.slug}`}
                  data-active={active ? 'true' : undefined}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => onSelect(post)}
                  className={`mx-1.5 block rounded-lg px-3 py-2.5 transition-colors ${
                    active ? 'bg-muted' : 'hover:bg-muted/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h4
                        className={`truncate text-sm font-semibold transition-colors ${
                          active ? 'text-accent' : 'text-foreground'
                        }`}
                      >
                        {post.title}
                      </h4>
                      <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{post.excerpt}</p>
                    </div>
                    <time className="shrink-0 whitespace-nowrap pt-0.5 text-xs text-muted-foreground/70">
                      {formatDisplayDate(post.date)}
                    </time>
                  </div>
                  {(post.tags?.length > 0 || typeof post.readMinutes === 'number') && (
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      {(post.tags ?? []).slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 rounded-md border border-border/60 bg-card/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
                        >
                          <span className="text-accent/70">#</span>
                          {tag}
                        </span>
                      ))}
                      {typeof post.readMinutes === 'number' && (
                        <span className="text-[11px] text-muted-foreground/60">{post.readMinutes} min read</span>
                      )}
                    </div>
                  )}
                </a>
              )
            })
          )}
        </div>

        <footer className="flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-border bg-muted/30 px-4 py-2 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Kbd>↑</Kbd>
            <Kbd>↓</Kbd>
            Navigate
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Kbd>↵</Kbd>
            Open
          </span>
          <span className="ml-auto inline-flex items-center gap-1.5">
            <Kbd>esc</Kbd>
            Close
          </span>
        </footer>
      </div>
    </div>,
    document.body
  )
}