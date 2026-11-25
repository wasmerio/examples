import { useState } from 'react'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

import { cn } from '@/lib/utils'

const PHOTOS = [
  {
    src: '/images/about-me/folder-01.webp',
    collapsed: 'rotate-[2deg] -translate-y-[48%]',
    hover:
      'group-hover/folder:rotate-[3deg] group-hover/folder:-translate-y-[52%] group-hover/folder:translate-x-1 group-hover/folder:scale-90',
    expanded: '-translate-x-16 -rotate-[10deg] -translate-y-18 scale-110'
  },
  {
    src: '/images/about-me/folder-02.webp',
    collapsed: '-translate-y-[43%]',
    hover: 'group-hover/folder:-translate-y-[47%] group-hover/folder:scale-90',
    expanded: '-translate-y-18 scale-110'
  },
  {
    src: '/images/about-me/folder-03.webp',
    collapsed: '-rotate-[2deg] -translate-y-[38%]',
    hover:
      'group-hover/folder:-rotate-[3deg] group-hover/folder:-translate-y-[42%] group-hover/folder:-translate-x-1 group-hover/folder:scale-90',
    expanded: 'translate-x-16 -translate-y-16 rotate-[10deg] scale-110'
  }
]

const TripFolderCard = () => {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card
      onClick={() => setExpanded(prev => !prev)}
      data-cursor='pointer'
      className='ring-border cursor-pointer justify-end gap-5 overflow-visible rounded-[24px] bg-(--background-darker) shadow-none'
    >
      <CardContent>
        <div className='group/folder relative flex aspect-video items-end justify-center'>
          {/* Back panel — always-visible backdrop behind the photos, matched to the folder's own width */}
          <div className='dark:border-primary/10 absolute bottom-0 left-1/2 z-0 h-36 w-40 -translate-x-1/2 rounded-xl border bg-(--background-darker)' />

          {PHOTOS.map((photo, i) => (
            <div
              key={photo.src}
              style={{ zIndex: i + 1 }}
              className={cn(
                'absolute aspect-290/230 h-auto w-36 overflow-hidden transition-all duration-500',
                expanded ? photo.expanded : cn(photo.collapsed, photo.hover)
              )}
            >
              <img src={photo.src} alt='folder images' className='object-cover' />
            </div>
          ))}

          <div
            className={cn(
              'relative z-10 origin-bottom transform-[perspective(2000px)_rotateX(-25deg)] transition-transform duration-500',
              !expanded && 'hover:transform-[perspective(3000px)_rotateX(-35deg)]',
              expanded && 'transform-[perspective(4000px)_rotateX(-45deg)]'
            )}
          >
            <img src='/images/about-me/folder-front.webp' alt='folder front' className='w-40' />
          </div>
        </div>
      </CardContent>

      <CardContent>
        <div className='flex items-center justify-center gap-3'>
          <p className='text-foreground text-xl font-medium text-nowrap xl:text-[26px]'>Spain trip</p>
          <Badge
            variant='secondary'
            className='text-muted dark:bg-background dark:text-primary/70 h-6.5 rounded-sm bg-white font-light'
          >
            76 photos
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

export default TripFolderCard
