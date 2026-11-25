import { useEffect, useRef, useState } from 'react'

import { isIdCardHover } from '@/lib/id-card-cursor'
import { cn } from '@/lib/utils'

const CURSOR_INTERACTIVE_SELECTOR =
  'a, button, [role="button"], input, textarea, select, label, summary, [data-cursor="pointer"]'

const CustomCursor = () => {
  const [isPointer, setIsPointer] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  const cursorRef = useRef<HTMLDivElement>(null)
  const positionRef = useRef({ x: 0, y: 0 })
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return

    document.documentElement.classList.add('custom-cursor-active')

    const renderPosition = () => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${positionRef.current.x}px, ${positionRef.current.y}px, 0)`
      }

      frameRef.current = requestAnimationFrame(renderPosition)
    }

    const handlePointerMove = (event: PointerEvent) => {
      positionRef.current = { x: event.clientX, y: event.clientY }
      setIsVisible(true)
      setIsPointer(
        Boolean((event.target as HTMLElement | null)?.closest(CURSOR_INTERACTIVE_SELECTOR)) || isIdCardHover()
      )
    }

    const handlePointerLeave = () => setIsVisible(false)

    frameRef.current = requestAnimationFrame(renderPosition)
    document.addEventListener('pointermove', handlePointerMove)
    document.addEventListener('pointerleave', handlePointerLeave)

    return () => {
      document.documentElement.classList.remove('custom-cursor-active')
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
      document.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('pointerleave', handlePointerLeave)
    }
  }, [])

  return (
    <div
      data-custom-cursor
      ref={cursorRef}
      className={cn(
        'pointer-events-none fixed top-0 left-0 z-[9999] hidden transition-opacity duration-150',
        isPointer ? '-translate-x-5.75 -translate-y-2.75' : '-translate-x-4.75 -translate-y-2.5',
        isVisible ? 'opacity-100' : 'opacity-0'
      )}
    >
      <img
        src={isPointer ? '/images/cursor/cursor-pointer.webp' : '/images/cursor/cursor.webp'}
        alt=''
        width={52}
        height={52}
      />
    </div>
  )
}

export default CustomCursor
