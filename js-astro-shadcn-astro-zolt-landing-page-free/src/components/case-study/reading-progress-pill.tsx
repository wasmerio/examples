import { useEffect, useRef, useState } from 'react'
import type { MouseEvent } from 'react'

import { CheckIcon } from 'lucide-react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react'

import { cn } from '@/lib/utils'

type ReadingProgressPillProps = {
  headings: { slug: string; text: string; depth: number }[]
  contentId: string
}

const HEADER_OFFSET = 150
const IDLE_LABEL = 'Points'
const HOVER_OPEN_DELAY = 500
const HOVER_CLOSE_DELAY = 200

const cornerCurveBackground = 'radial-gradient(circle at 100% 100%, transparent 15.5px, var(--card) 16px)'

const ReadingProgressPill = ({ headings, contentId }: ReadingProgressPillProps) => {
  const [percent, setPercent] = useState(0)
  const [activeSlug, setActiveSlug] = useState('')
  const [activeLabel, setActiveLabel] = useState(IDLE_LABEL)
  const [isOpen, setIsOpen] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const rawProgress = useMotionValue(0)
  const progress = useSpring(rawProgress, { stiffness: 120, damping: 20, mass: 0.5 })

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset
      const viewportHeight = window.innerHeight

      const contentEl = document.getElementById(contentId)
      const contentTop = contentEl ? contentEl.getBoundingClientRect().top + scrollY : 0
      const contentHeight = contentEl ? contentEl.offsetHeight : document.documentElement.scrollHeight
      const scrollable = contentHeight - viewportHeight

      const nextPercent =
        scrollable > 0
          ? Math.min(100, Math.max(0, Math.round(((scrollY - contentTop) / scrollable) * 100)))
          : scrollY >= contentTop
            ? 100
            : 0

      setPercent(nextPercent)
      rawProgress.set(nextPercent / 100)

      const headingElements = headings
        .map(heading => document.getElementById(heading.slug))
        .filter((el): el is HTMLElement => Boolean(el))

      let currentSlug = ''
      let currentLabel = IDLE_LABEL

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const heading = headingElements[i]
        const headingTop = heading.getBoundingClientRect().top + scrollY

        if (headingTop - HEADER_OFFSET <= scrollY) {
          currentSlug = headings[i].slug
          currentLabel = headings[i].text
          break
        }
      }

      setActiveSlug(currentSlug)
      setActiveLabel(currentLabel)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [headings, rawProgress, contentId])

  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const clearHoverTimeout = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }
  }

  const handleMouseEnter = () => {
    clearHoverTimeout()
    hoverTimeoutRef.current = setTimeout(() => setIsOpen(true), HOVER_OPEN_DELAY)
  }

  const handleMouseLeave = () => {
    clearHoverTimeout()
    hoverTimeoutRef.current = setTimeout(() => setIsOpen(false), HOVER_CLOSE_DELAY)
  }

  const handleHeadingClick = (event: MouseEvent<HTMLAnchorElement>, slug: string) => {
    event.preventDefault()
    document.getElementById(slug)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

    // Deferred so the pill's layout-collapse animation doesn't cancel the smooth scroll
    setTimeout(() => setIsOpen(false), 400)
  }

  const isComplete = percent >= 100

  return (
    <div
      ref={containerRef}
      className='fixed inset-x-0 top-0 z-70 flex justify-center max-md:mx-4'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
        className='bg-card relative w-fit min-w-58.5 rounded-b-[20px] shadow-lg'
      >
        <div
          className='pointer-events-none absolute top-0 -left-4 size-4 scale-x-[-1]'
          style={{ backgroundImage: cornerCurveBackground }}
        />
        <div
          className='pointer-events-none absolute top-0 -right-4 size-4'
          style={{ backgroundImage: cornerCurveBackground }}
        />

        <motion.button
          layout='position'
          type='button'
          onClick={() => setIsOpen(open => !open)}
          className='flex w-full items-center gap-2 px-3 py-3.75'
        >
          <div className='relative flex size-8.5 shrink-0 items-center justify-center'>
            <svg viewBox='0 0 32 32' className='absolute inset-0 -rotate-90'>
              <circle cx='16' cy='16' r='13' fill='none' strokeWidth='1' className='stroke-card' />
              <motion.circle
                cx='16'
                cy='16'
                r='13'
                fill='none'
                strokeWidth='2'
                strokeLinecap='round'
                className='stroke-accent'
                style={{ pathLength: progress }}
              />
            </svg>

            <AnimatePresence mode='wait'>
              {isComplete ? (
                <motion.span
                  key='check'
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                >
                  <CheckIcon className='text-accent size-3.5' />
                </motion.span>
              ) : (
                <motion.span
                  key='percent'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className='text-[10px]'
                >
                  {percent}%
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence mode='wait'>
            <motion.span
              key={activeLabel}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className='text-base'
            >
              {activeLabel}
            </motion.span>
          </AnimatePresence>
        </motion.button>

        <AnimatePresence>
          {isOpen && headings.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <nav className='px-4 pb-4'>
                <ul className='flex flex-col gap-3'>
                  {headings.map(heading => (
                    <li key={heading.slug}>
                      <a
                        href={`#${heading.slug}`}
                        onClick={event => handleHeadingClick(event, heading.slug)}
                        className={cn(
                          'block w-full text-left text-base whitespace-nowrap no-underline transition-colors',
                          heading.slug === activeSlug
                            ? 'text-foreground font-medium'
                            : 'text-muted-foreground hover:text-foreground'
                        )}
                      >
                        {heading.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default ReadingProgressPill
