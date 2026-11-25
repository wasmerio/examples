import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Search, Loader2, FileText, Calendar, Hash, Clock, AlertCircle, ChevronDown, X } from 'lucide-react'
import { Index } from 'flexsearch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { PERFORMANCE } from '@/lib/constants'

interface SearchResult {
  id: string
  title: string
  description: string
  date: string
  tags: string[]
  authors: string[]
  url: string
  content: string
}

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// LocalStorage keys
const STORAGE_KEYS = {
  SEARCH_INDEX: 'search_index',
  SEARCH_INDEX_VERSION: 'search_index_version',
  SEARCH_HISTORY: 'search_history',
} as const

// Cache version - increment when index structure changes
const INDEX_VERSION = '1.0'


// Calculate relevance score
function calculateRelevanceScore(
  result: SearchResult,
  query: string,
  queryLower: string,
): number {
  let score = 0
  const titleLower = result.title.toLowerCase()
  const descLower = result.description.toLowerCase()
  const contentLower = result.content.toLowerCase()
  const tagsLower = (result.tags || []).join(' ').toLowerCase()

  // Exact title match (highest priority)
  if (titleLower === queryLower) {
    score += 1000
  } else if (titleLower.startsWith(queryLower)) {
    score += 500
  } else if (titleLower.includes(queryLower)) {
    score += 300
  }

  // Title word matches
  const titleWords = titleLower.split(/\s+/)
  const queryWords = queryLower.split(/\s+/)
  queryWords.forEach((qWord) => {
    titleWords.forEach((tWord) => {
      if (tWord === qWord) score += 50
      else if (tWord.startsWith(qWord)) score += 30
      else if (tWord.includes(qWord)) score += 10
    })
  })

  // Description match
  if (descLower.includes(queryLower)) {
    score += 100
  }
  queryWords.forEach((qWord) => {
    if (descLower.includes(qWord)) score += 20
  })

  // Tag matches
  queryWords.forEach((qWord) => {
    if (tagsLower.includes(qWord)) score += 40
  })

  // Content match (lower priority)
  if (contentLower.includes(queryLower)) {
    score += 10
  }
  queryWords.forEach((qWord) => {
    const matches = (contentLower.match(new RegExp(qWord, 'g')) || []).length
    score += matches * 2
  })

  // Recency boost (newer posts get slight boost)
  try {
    const postDate = new Date(result.date)
    const now = new Date()
    const daysSince = (now.getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24)
    if (daysSince < 30) score += 5
    else if (daysSince < 90) score += 2
  } catch {
    // Ignore date errors
  }

  return score
}

// Get search history from localStorage
function getSearchHistory(): string[] {
  try {
    const history = localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY)
    return history ? JSON.parse(history) : []
  } catch {
    return []
  }
}

// Save search to history
function saveSearchHistory(query: string): void {
  if (!query.trim()) return
  try {
    const history = getSearchHistory()
    const normalizedQuery = query.trim().toLowerCase()
    // Remove if exists and add to front
    const filtered = history.filter((q) => q.toLowerCase() !== normalizedQuery)
    const updated = [normalizedQuery, ...filtered].slice(0, 10) // Keep last 10
    localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(updated))
  } catch {
    // Ignore localStorage errors
  }
}

// Get cached search index
function getCachedIndex(): { data: SearchResult[]; version: string } | null {
  try {
    const cached = localStorage.getItem(STORAGE_KEYS.SEARCH_INDEX)
    const version = localStorage.getItem(STORAGE_KEYS.SEARCH_INDEX_VERSION)
    if (cached && version === INDEX_VERSION) {
      return { data: JSON.parse(cached), version }
    }
  } catch {
    // Ignore errors
  }
  return null
}

// Cache search index
function cacheIndex(data: SearchResult[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SEARCH_INDEX, JSON.stringify(data))
    localStorage.setItem(STORAGE_KEYS.SEARCH_INDEX_VERSION, INDEX_VERSION)
  } catch {
    // Ignore localStorage errors (quota exceeded, etc.)
  }
}

// Extract content snippet around search terms
function extractSnippet(content: string, query: string, maxLength: number = 150): string {
  if (!content) return content.substring(0, maxLength)
  if (!query) return content.substring(0, maxLength) + (content.length > maxLength ? '...' : '')
  
  const queryLower = query.toLowerCase()
  const contentLower = content.toLowerCase()
  const index = contentLower.indexOf(queryLower)
  
  if (index === -1) {
    return content.substring(0, maxLength) + (content.length > maxLength ? '...' : '')
  }
  
  const start = Math.max(0, index - 50)
  const end = Math.min(content.length, index + query.length + maxLength - 50)
  let snippet = content.substring(start, end)
  
  if (start > 0) snippet = '...' + snippet
  if (end < content.length) snippet = snippet + '...'
  
  return snippet
}

const SearchDialog: React.FC<SearchDialogProps> = ({ open, onOpenChange }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingIndex, setIsLoadingIndex] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [searchIndex, setSearchIndex] = useState<SearchResult[]>([])
  const [index, setIndex] = useState<Index | null>(null)
  const [displayedResults, setDisplayedResults] = useState(10)
  const [recentPosts, setRecentPosts] = useState<SearchResult[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLUListElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const listboxId = 'search-results-listbox'

  // Load search index (with caching)
  useEffect(() => {
    if (!open) return

    let cancelled = false

    const loadSearchIndex = async () => {
      // Check cache first
      const cached = getCachedIndex()
      if (cached && cached.data.length > 0) {
        setSearchIndex(cached.data)
        setIsLoadingIndex(false)
        
        // Create FlexSearch index from cached data
        const searchIndex = new Index({
          tokenize: 'forward',
        })

        cached.data.forEach((item, idx) => {
          const searchableText = [
            item.title || '',
            item.description || '',
            (item.tags || []).join(' '),
            item.content || '',
          ]
            .join(' ')
            .toLowerCase()
          searchIndex.add(idx, searchableText)
        })

        if (!cancelled) {
          setIndex(searchIndex)
          // Set recent posts from cached data
          setRecentPosts(cached.data.slice(0, 5))
        }
        return
      }

      setIsLoadingIndex(true)
      setError(null)

      try {
        const response = await fetch('/api/search-index.json')
        if (!response.ok) throw new Error('Failed to load search index')
        const data: SearchResult[] = await response.json()
        
        if (cancelled) return
        
        // Cache the index
        cacheIndex(data)
        
        setSearchIndex(data)
        setRecentPosts(data.slice(0, 5))

        // Create FlexSearch index
        const searchIndex = new Index({
          tokenize: 'forward',
        })

        // Index all fields
        data.forEach((item, idx) => {
          const searchableText = [
            item.title || '',
            item.description || '',
            (item.tags || []).join(' '),
            item.content || '',
          ]
            .join(' ')
            .toLowerCase()
          searchIndex.add(idx, searchableText)
        })

        if (!cancelled) {
          setIndex(searchIndex)
        }
      } catch (error) {
        if (!cancelled) {
          console.error('Error loading search index:', error)
          setError('Failed to load search index. Please try again later.')
        }
      } finally {
        if (!cancelled) {
          setIsLoadingIndex(false)
        }
      }
    }

    // Only load if index hasn't been loaded yet
    if (!index) {
      loadSearchIndex()
    } else if (recentPosts.length === 0 && searchIndex.length > 0) {
      setRecentPosts(searchIndex.slice(0, 5))
    }

    return () => {
      cancelled = true
    }
  }, [open, index, searchIndex.length, recentPosts.length])

  // Perform search with fuzzy matching and improved relevance
  const performSearch = useCallback(
    (searchQuery: string) => {
      if (!index || !searchQuery.trim()) {
        setResults([])
        setSelectedIndex(0)
        setDisplayedResults(10)
        return
      }

      setIsLoading(true)
      setError(null)
      const normalizedQuery = searchQuery.toLowerCase().trim()

      try {
        // Save to search history
        saveSearchHistory(searchQuery)

        // First try exact search
        let searchResults = index.search(normalizedQuery, {
          limit: 50, // Get more results for better sorting
        })

        // If no results, try fuzzy matching
        if (searchResults.length === 0 && normalizedQuery.length > 2) {
          // Try searching with each word separately
          const words = normalizedQuery.split(/\s+/)
          const wordResults = new Set<number>()
          
          words.forEach((word) => {
            if (word.length > 2) {
              const wordSearch = index.search(word, { limit: 20 })
              wordSearch.forEach((idx) => wordResults.add(Number(idx)))
            }
          })
          
          searchResults = Array.from(wordResults)
        }

        const matchedResults = searchResults
          .map((idx: number | string) => searchIndex[Number(idx)])
          .filter(Boolean) as SearchResult[]

        // Calculate relevance scores and sort
        const scoredResults = matchedResults.map((result) => ({
          result,
          score: calculateRelevanceScore(result, searchQuery, normalizedQuery),
        }))

        // Sort by score (descending)
        scoredResults.sort((a, b) => b.score - a.score)

        // Extract results
        const sortedResults = scoredResults.map((item) => item.result)

        setResults(sortedResults)
        setSelectedIndex(0)
        setDisplayedResults(10) // Reset to first 10
      } catch (error) {
        console.error('Search error:', error)
        setError('An error occurred while searching. Please try again.')
        setResults([])
      } finally {
        setIsLoading(false)
      }
    },
    [index, searchIndex],
  )

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setSelectedIndex(0)
      setDisplayedResults(10)
      return
    }

    const timeoutId = setTimeout(() => {
      performSearch(query)
    }, PERFORMANCE.SEARCH_DEBOUNCE)

    return () => clearTimeout(timeoutId)
  }, [query, performSearch])

  // Focus input when dialog opens and reset scroll position
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus()
        // Reset scroll position to top when dialog opens
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = 0
        }
      }, 100)
      setQuery('')
      setResults([])
      setSelectedIndex(0)
      setDisplayedResults(10)
      setError(null)
    }
  }, [open])

  // Reset scroll position when query changes (new search)
  useEffect(() => {
    if (scrollContainerRef.current && query.trim()) {
      // Small delay to ensure DOM is updated
      const timeoutId = setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = 0
        }
      }, 100)
      return () => clearTimeout(timeoutId)
    }
  }, [query])

  // Keyboard navigation
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        const maxIndex = Math.min(displayedResults - 1, results.length - 1)
        setSelectedIndex((prev) =>
          prev < maxIndex ? prev + 1 : prev,
        )
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0))
      } else if (e.key === 'Enter' && results[selectedIndex]?.url) {
        e.preventDefault()
        const url = results[selectedIndex].url
        if (url) {
          // Use proper navigation that preserves browser history
          window.location.href = url
          onOpenChange(false)
        }
      } else if (e.key === 'Escape') {
        onOpenChange(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, results, selectedIndex, onOpenChange, displayedResults])

  // Scroll selected result into view
  useEffect(() => {
    if (resultsRef.current && selectedIndex >= 0) {
      const selectedElement = resultsRef.current.children[selectedIndex] as
        | HTMLElement
        | undefined
      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        })
      }
    }
  }, [selectedIndex])

  // Highlight search terms in text
  const highlightText = (text: string, query: string) => {
    if (!query.trim() || !text) return text

    try {
      // Escape special regex characters in query
      const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const parts = text.split(new RegExp(`(${escapedQuery})`, 'gi'))
      return parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark
            key={i}
            className="bg-primary/20 text-primary dark:bg-primary/30 dark:text-primary font-medium"
          >
            {part}
          </mark>
        ) : (
          part
        ),
      )
    } catch (error) {
      // Fallback to plain text if regex fails
      return text
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return dateString // Return original if invalid date
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    } catch (error) {
      return dateString // Return original on error
    }
  }

  const searchHistory = getSearchHistory()
  const hasMoreResults = results.length > displayedResults
  const visibleResults = results.slice(0, displayedResults)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-full sm:max-w-lg md:max-w-2xl p-0 gap-0 overflow-hidden top-0 sm:top-[10%] translate-y-0 h-[100dvh] sm:h-auto sm:max-h-[85vh] flex flex-col rounded-none sm:rounded-lg data-[state=open]:slide-in-from-top-0 data-[state=closed]:slide-out-to-top-0">
        <DialogDescription className="sr-only">
          Search blog posts by title, description, tags, or content
        </DialogDescription>
        {/* Live region for screen readers */}
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        >
          {isLoadingIndex && 'Loading search index...'}
          {isLoading && 'Searching...'}
          {!isLoading && !isLoadingIndex && query.trim() && results.length > 0 && `${results.length} result${results.length !== 1 ? 's' : ''} found`}
          {!isLoading && !isLoadingIndex && query.trim() && results.length === 0 && 'No results found'}
          {selectedIndex >= 0 && results[selectedIndex] && `Selected: ${results[selectedIndex].title}`}
        </div>
        <div className="flex shrink-0 items-center border-b border-border px-4 sm:px-4 pt-safe relative">
          <Search className="mr-3 h-5 w-5 shrink-0 text-muted-foreground sm:h-4 sm:w-4" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search posts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex h-16 sm:h-14 w-full bg-transparent py-4 sm:py-3 pr-12 sm:pr-0 text-base sm:text-sm outline-none border-0 shadow-none appearance-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-0"
            style={{ 
              WebkitAppearance: 'none', 
              MozAppearance: 'textfield',
              border: 'none',
              outline: 'none',
              boxShadow: 'none',
            }}
            aria-label="Search blog posts"
            aria-expanded={results.length > 0}
            aria-controls={listboxId}
            aria-activedescendant={results.length > 0 && selectedIndex >= 0 ? `result-${selectedIndex}` : undefined}
            role="combobox"
            aria-autocomplete="list"
          />
          {isLoading && (
            <Loader2 className="absolute right-14 sm:relative sm:right-0 ml-2 h-5 w-5 sm:h-4 sm:w-4 animate-spin text-muted-foreground shrink-0" />
          )}
          {/* Close button for mobile - positioned in header */}
          <button
            onClick={() => onOpenChange(false)}
            className="sm:hidden absolute right-4 top-1/2 -translate-y-1/2 rounded-lg p-2 opacity-70 transition-opacity active:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-label="Close search"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div
            role="alert"
            className="flex shrink-0 items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive mx-4 mt-2"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div
          ref={scrollContainerRef}
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 py-4 sm:px-2 sm:py-2"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {/* Loading skeleton */}
          {isLoadingIndex && (
            <div className="space-y-2 py-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse rounded-md bg-muted p-3">
                  <div className="h-4 w-3/4 bg-muted-foreground/20 rounded mb-2" />
                  <div className="h-3 w-full bg-muted-foreground/20 rounded mb-1" />
                  <div className="h-3 w-2/3 bg-muted-foreground/20 rounded" />
                </div>
              ))}
            </div>
          )}

          {/* No query - show suggestions */}
          {!query.trim() && !isLoadingIndex && (
            <div className="py-4">
              {/* Recent posts */}
              {recentPosts.length > 0 && (
                <div className="mb-6">
                  <h3 className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Recent Posts
                  </h3>
                  <ul className="space-y-2 sm:space-y-1">
                    {recentPosts.map((post) => (
                      <li key={post.id}>
                        <a
                          href={post.url}
                          onClick={() => onOpenChange(false)}
                          className="flex flex-col gap-2 rounded-lg sm:rounded-md p-4 sm:p-3 transition-colors active:bg-muted focus:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-medium text-base sm:text-sm leading-tight">
                              {post.title}
                            </h3>
                            <div className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span className="hidden sm:inline">{formatDate(post.date)}</span>
                            </div>
                          </div>
                          {post.description && (
                            <p className="text-sm sm:text-xs text-muted-foreground line-clamp-2">
                              {post.description}
                            </p>
                          )}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Search history */}
              {searchHistory.length > 0 && (
                <div>
                  <h3 className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Recent Searches
                  </h3>
                  <div className="flex flex-wrap gap-2 px-2">
                    {searchHistory.slice(0, 5).map((term, idx) => (
                      <button
                        key={idx}
                        onClick={() => setQuery(term)}
                        className="inline-flex items-center gap-1 rounded-md bg-muted px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <Clock className="h-3 w-3" />
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty state if no suggestions */}
              {recentPosts.length === 0 && searchHistory.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Search className="mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Start typing to search posts...
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Search by title, description, tags, or content
                  </p>
                </div>
              )}
            </div>
          )}

          {/* No results */}
          {query.trim() && results.length === 0 && !isLoading && !isLoadingIndex && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <FileText className="mb-2 h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No results found for &quot;{query}&quot;
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Try different keywords or check your spelling
              </p>
            </div>
          )}

          {/* Results */}
          {visibleResults.length > 0 && (
            <ul
              ref={resultsRef}
              id={listboxId}
              role="listbox"
              aria-label="Search results"
              className="space-y-1"
            >
              {visibleResults.map((result, idx) => (
                <li
                  key={result.id}
                  id={`result-${idx}`}
                  role="option"
                  aria-selected={idx === selectedIndex}
                >
                  <a
                    href={result.url}
                    onClick={() => onOpenChange(false)}
                    className={cn(
                      'flex flex-col gap-3 sm:gap-2.5 rounded-lg sm:rounded-md p-4 sm:p-3.5 transition-colors',
                      'active:bg-muted focus-visible:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                      idx === selectedIndex && 'bg-muted',
                    )}
                    aria-label={`Go to ${result.title}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-medium text-base sm:text-sm leading-snug flex-1">
                        {highlightText(result.title, query)}
                      </h3>
                      <div className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span className="hidden sm:inline">{formatDate(result.date)}</span>
                      </div>
                    </div>

                    {result.description && (
                      <p className="text-sm sm:text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {highlightText(result.description, query)}
                      </p>
                    )}

                    {/* Content snippet - hidden on mobile for cleaner UI */}
                    {result.content && (
                      <p className="hidden sm:block text-xs text-muted-foreground/80 line-clamp-2 leading-relaxed italic">
                        {highlightText(extractSnippet(result.content, query), query)}
                      </p>
                    )}

                    {result.tags && result.tags.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        {result.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 sm:px-1.5 sm:py-0.5 text-xs text-muted-foreground"
                          >
                            <Hash className="h-3 w-3" />
                            {tag}
                          </span>
                        ))}
                        {result.tags.length > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{result.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          )}

          {/* Load more button */}
          {hasMoreResults && (
            <div className="mt-6 mb-4 sm:mt-4 sm:mb-2 flex justify-center pb-safe">
              <button
                onClick={() => setDisplayedResults((prev) => Math.min(prev + 10, results.length))}
                className="flex items-center gap-2 rounded-lg sm:rounded-md border border-border bg-background px-6 py-3 sm:px-4 sm:py-2 text-base sm:text-sm text-foreground transition-colors active:bg-muted focus:outline-none focus:ring-2 focus:ring-ring shadow-sm"
              >
                <ChevronDown className="h-5 w-5 sm:h-4 sm:w-4" />
                Load more ({results.length - displayedResults} remaining)
              </button>
            </div>
          )}
          
          {/* Extra padding at bottom for mobile to ensure last items are scrollable */}
          <div className="h-4 sm:h-2" aria-hidden="true" />
        </div>

        {results.length > 0 && (
          <div className="flex shrink-0 items-center justify-center border-t border-border bg-background px-4 py-3 sm:py-2 text-xs text-muted-foreground">
            <div className="hidden sm:flex flex-wrap items-center gap-4">
              <span>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
                  ↑↓
                </kbd>{' '}
                navigate
              </span>
              <span>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
                  ↵
                </kbd>{' '}
                select
              </span>
              <span>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
                  esc
                </kbd>{' '}
                close
              </span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default SearchDialog
