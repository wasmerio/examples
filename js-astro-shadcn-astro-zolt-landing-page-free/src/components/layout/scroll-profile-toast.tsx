import { useEffect, useState } from 'react'

import { AnimatePresence, motion } from 'motion/react'

import ProfileAvailabilityCard from '@/components/layout/profile-availability-card'

const SCROLL_THRESHOLD = 300

const isDetailPage = (pathname: string) => pathname.startsWith('/case-study/')

const cornerCurveBackground = 'radial-gradient(circle at 100% 100%, transparent 15.5px, var(--card) 16px)'

type ScrollProfileToastProps = {
  pathname: string
}

const ScrollProfileToast = ({ pathname }: ScrollProfileToastProps) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > SCROLL_THRESHOLD)

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (isDetailPage(pathname)) return null

  const goHome = () => {
    // Already home — a location.href reassignment to the same URL reloads the page and the
    // browser's scroll restoration snaps it right back to the pre-click position, so just
    // scroll instead. Only other pages (e.g. /contact) need a real navigation.
    if (pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      window.location.href = '/'
    }
  }

  return (
    <div className='pointer-events-none fixed inset-x-0 top-0 z-70 flex justify-center'>
      <AnimatePresence>
        {isVisible && (
          <motion.button
            type='button'
            onClick={goHome}
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2 }}
            className='bg-card pointer-events-auto relative rounded-b-[20px] shadow-lg'
          >
            <div
              className='pointer-events-none absolute top-0 -left-4 size-4 scale-x-[-1]'
              style={{ backgroundImage: cornerCurveBackground }}
            />
            <div
              className='pointer-events-none absolute top-0 -right-4 size-4'
              style={{ backgroundImage: cornerCurveBackground }}
            />
            <ProfileAvailabilityCard />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ScrollProfileToast
