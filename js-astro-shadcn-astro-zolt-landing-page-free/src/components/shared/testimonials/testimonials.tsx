import { useState } from 'react'

import { ArrowLeftIcon, ArrowRightIcon, QuoteIcon } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'

import Eyebrow from '@/components/shared/eyebrow/eyebrow'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Testimonial = {
  quote: string
  name: string
  role: string
  avatar: string
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Working with Zolt was a different experience. He didn't just deliver designs he delivered a working product.",
    name: 'Marcus Reid',
    role: 'Co-founder, Orion Labs',
    avatar: '/images/testimonials/avatar-01.webp'
  },
  {
    quote:
      'Zolt built our entire design system in under a month. Every component was documented, every token was connected.',
    name: 'Priya Nair',
    role: 'Product Lead, Lumio SaaS',
    avatar: '/images/testimonials/avatar-02.webp'
  },
  {
    quote:
      "I've hired a lot of freelancers. Zolt is the rare one who actually cares about the craft. He flagged things I hadn't even noticed.",
    name: 'Daniel Hoffmann',
    role: 'CTO, Trackflow HQ',
    avatar: '/images/testimonials/avatar-03.webp'
  }
]

const TILE_SIZE = 100
const TILE_GAP = 8
const BLOCK_HEIGHT = TILE_SIZE * 3 + TILE_GAP * 2
const SHADOW_ROOM = 60
const VIEWPORT_HEIGHT = BLOCK_HEIGHT + SHADOW_ROOM
const SIDE_ROOM = 40
const VIEWPORT_WIDTH = TILE_SIZE + SIDE_ROOM * 2
const SIDE_COLUMN_TILES = 5
const COLUMN_STEP = TILE_SIZE + TILE_GAP
const ROW_OFFSET = COLUMN_STEP / 2

const TILE_CLASS = 'bg-card size-25 rounded-md border border-border/70 shadow-xs'

const slideVariants = {
  enter: (direction: number) => ({ y: direction > 0 ? 32 : -32, opacity: 0 }),
  center: { y: 0, opacity: 1 },
  exit: (direction: number) => ({ y: direction > 0 ? -32 : 32, opacity: 0 })
}

const sideColumnVariants = {
  initial: { y: ROW_OFFSET + COLUMN_STEP },
  animate: { y: ROW_OFFSET },
  exit: { y: ROW_OFFSET - COLUMN_STEP }
}

const MiddleColumnBlock = ({ avatar, name }: { avatar: string; name: string }) => (
  <div className='mx-auto w-fit space-y-2'>
    <div className={TILE_CLASS} />
    <div className='shadow-realistic relative size-25 rounded-md'>
      <img src={avatar} alt={name} className='absolute inset-0 h-full w-full rounded-md object-cover' />
    </div>
    <div className={TILE_CLASS} />
  </div>
)

type TestimonialsProps = {
  showBorder?: boolean
}

const Testimonials = ({ showBorder = true }: TestimonialsProps) => {
  const [index, setIndex] = useState(0)
  const [previousIndex, setPreviousIndex] = useState(0)
  const [direction, setDirection] = useState(1)

  const goTo = (nextDirection: number) => {
    setPreviousIndex(index)
    setIndex(current => (current + nextDirection + TESTIMONIALS.length) % TESTIMONIALS.length)
    setDirection(nextDirection)
  }

  const testimonial = TESTIMONIALS[index]
  const outgoing = TESTIMONIALS[previousIndex]

  return (
    <section id='testimonials' className={cn('py-8 sm:py-16 lg:py-24', showBorder && 'border-b')}>
      <div className='mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:space-y-16 lg:px-10.5'>
        <div className='space-y-2'>
          <Eyebrow>Good words</Eyebrow>
          <h2 className='text-2xl font-semibold md:text-3xl lg:text-4xl'>
            some good words from people I&apos;ve worked with
          </h2>
        </div>

        <div className='grid grid-cols-1 items-center gap-6 sm:grid-cols-[323px_1fr] sm:gap-8'>
          <div className='relative mx-auto h-78 w-full mask-[radial-gradient(ellipse_at_center,black_25%,transparent_80%)] sm:mx-0'>
            <div className='absolute inset-0 grid h-auto grid-cols-3 content-center gap-3 max-sm:mx-auto max-sm:w-fit'>
              <AnimatePresence initial={false}>
                <motion.div
                  key={`left-${index}`}
                  style={{ gridColumn: 1, gridRow: 1, alignSelf: 'center' }}
                  variants={sideColumnVariants}
                  initial='initial'
                  animate='animate'
                  exit='exit'
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className='space-y-2'
                >
                  {Array.from({ length: SIDE_COLUMN_TILES }, (_, tileIndex) => (
                    <div key={tileIndex} className={TILE_CLASS} />
                  ))}
                </motion.div>
              </AnimatePresence>

              <div
                className='relative'
                style={{ gridColumn: 2, gridRow: 1, alignSelf: 'center', width: TILE_SIZE, height: VIEWPORT_HEIGHT }}
              >
                <div
                  className='absolute top-0 mask-[linear-gradient(to_bottom,transparent,black_18%,black_82%,transparent)]'
                  style={{
                    left: '50%',
                    transform: `translate(-50%, ${SHADOW_ROOM / 2}px)`,
                    width: VIEWPORT_WIDTH,
                    height: VIEWPORT_HEIGHT
                  }}
                >
                  <motion.div
                    key={index}
                    initial={{ y: -VIEWPORT_HEIGHT }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  >
                    <MiddleColumnBlock avatar={testimonial.avatar} name={testimonial.name} />
                    <div style={{ marginTop: SHADOW_ROOM }}>
                      <MiddleColumnBlock avatar={outgoing.avatar} name={outgoing.name} />
                    </div>
                  </motion.div>
                </div>
              </div>

              <AnimatePresence initial={false}>
                <motion.div
                  key={`right-${index}`}
                  style={{ gridColumn: 3, gridRow: 1, alignSelf: 'center' }}
                  variants={sideColumnVariants}
                  initial='initial'
                  animate='animate'
                  exit='exit'
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className='space-y-2'
                >
                  {Array.from({ length: SIDE_COLUMN_TILES }, (_, tileIndex) => (
                    <div key={tileIndex} className={TILE_CLASS} />
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className='overflow-hidden'>
            <div className='mb-8'>
              <QuoteIcon className='fill-accent size-9 rotate-180 text-transparent' />
            </div>

            <AnimatePresence initial={false} custom={direction} mode='wait'>
              <motion.div
                key={index}
                custom={direction}
                variants={slideVariants}
                initial='enter'
                animate='center'
                exit='exit'
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className='space-y-5'
              >
                <p className='text-primary max-w-lg text-xl font-medium lg:text-[26px]'>{testimonial.quote}</p>
                <div>
                  <p className='text-base font-medium'>{testimonial.name}</p>
                  <p className='text-muted-foreground text-xs'>{testimonial.role}</p>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className='mt-6 flex gap-3'>
              <Button
                onClick={() => goTo(-1)}
                aria-label='Previous testimonial'
                variant='outline'
                size='icon'
                className='hover:border-accent/30 dark:hover:border-accent/30 text-accent hover:bg-accent/10 dark:hover:bg-accent/10 hover:text-accent flex items-center justify-center rounded-full border transition-colors'
              >
                <ArrowLeftIcon className='size-4' />
              </Button>
              <Button
                onClick={() => goTo(1)}
                aria-label='Next testimonial'
                variant='outline'
                size='icon'
                className='hover:border-accent/30 dark:hover:border-accent/30 text-accent hover:bg-accent/10 dark:hover:bg-accent/10 hover:text-accent flex items-center justify-center rounded-full border transition-colors'
              >
                <ArrowRightIcon className='size-4' />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
