import { useEffect, useState } from 'react'

import { AnimatePresence, motion } from 'motion/react'

import { Card } from '@/components/ui/card'

import { cn } from '@/lib/utils'

const totalSeconds = 181
const EQ_BAR_DELAYS = ['[animation-delay:0ms]', '[animation-delay:150ms]', '[animation-delay:300ms]']

const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

const MusicPlayerCard = () => {
  const [expanded, setExpanded] = useState(true)
  const [seconds, setSeconds] = useState(70)

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds(prev => (prev + 1) % (totalSeconds + 1))
    }, 1000)

    return () => clearInterval(id)
  }, [])

  return (
    <Card
      onClick={() => setExpanded(prev => !prev)}
      data-cursor='pointer'
      className='ring-border relative cursor-pointer gap-0 overflow-hidden rounded-[24px] bg-(--background-darker) p-0 shadow-none'
    >
      <div
        className={cn(
          'relative overflow-hidden transition-all duration-500',
          expanded
            ? 'h-32 rounded-[0_0_50%_50%/0_0_70%_70%]'
            : 'h-full rounded-b-[16px] max-lg:min-h-80 max-md:min-h-55'
        )}
      >
        <img
          src='/images/about-me/music.webp'
          alt='See you again cover art'
          className='absolute inset-0 size-full object-cover object-bottom'
        />
      </div>
      <div
        className={cn(
          'absolute top-0 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 transition-all duration-500',
          expanded ? 'opacity-100' : 'opacity-0'
        )}
      >
        <div className='ring-background/40 relative size-8 overflow-hidden rounded-full ring-2'>
          <img src='/images/about-me/eye.webp' alt='eye image' className='absolute inset-0 size-full object-cover' />
        </div>
      </div>

      <div
        className={cn(
          'grid transition-[grid-template-rows] duration-500',
          expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        )}
      >
        <div className='overflow-hidden'>
          <div
            className={cn(
              'space-y-1.5 px-4 py-4 text-center transition-all duration-3000',
              expanded ? 'opacity-100 blur-none' : 'opacity-0 blur-lg'
            )}
          >
            <span className='text-muted-foreground mx-auto flex h-3 w-fit items-center gap-0.5'>
              {EQ_BAR_DELAYS.map((delay, bar) => (
                <span
                  key={bar}
                  className={cn(
                    'h-full w-0.5 origin-center animate-[eq_0.9s_ease-in-out_infinite] rounded-full bg-current',
                    delay
                  )}
                />
              ))}
            </span>
            <p className='text-muted-foreground text-xs'>Tyler</p>
            <p className='text-sm font-medium'>See you again</p>
            <div className='bg-muted mx-auto h-px w-6' />
            <p className='text-muted-foreground flex items-center justify-center gap-1 text-xs tabular-nums'>
              <span className='flex'>
                {formatTime(seconds)
                  .split('')
                  .map((char, i) => (
                    <span key={i} className='relative inline-grid overflow-hidden'>
                      <AnimatePresence mode='popLayout' initial={false}>
                        <motion.span
                          key={char}
                          initial={{ y: '100%', opacity: 0 }}
                          animate={{ y: '0%', opacity: 1 }}
                          exit={{ y: '-100%', opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className='col-start-1 row-start-1'
                        >
                          {char}
                        </motion.span>
                      </AnimatePresence>
                    </span>
                  ))}
              </span>
              <span>/ {formatTime(totalSeconds)}</span>
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default MusicPlayerCard
