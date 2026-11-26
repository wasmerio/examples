import type { ReactNode } from 'react'

import { Badge } from '@/components/ui/badge'

type TimelineItemProps = {
  date: string
  version: string
  children: ReactNode
}

const TimelineItem = ({ date, version, children }: TimelineItemProps) => {
  return (
    <div id={version} className='relative flex scroll-mt-18 justify-end gap-2'>
      <div className='sticky top-19 flex w-36 flex-col items-end gap-2 self-start pb-4 max-md:hidden'>
        <Badge className='flex size-6 w-auto justify-end rounded-sm text-sm font-medium'>{version}</Badge>
        <div className='text-muted-foreground text-right text-sm font-medium'>{date}</div>
      </div>
      <div className='flex flex-col items-center gap-2'>
        <div className='sticky top-19 flex size-6 items-center justify-center'>
          <span className='bg-primary/20 flex size-4.5 shrink-0 items-center justify-center rounded-full'>
            <span className='bg-primary size-3 rounded-full' />
          </span>
        </div>
        <span className='w-px flex-1 border' />
      </div>
      <div className='flex flex-1 flex-col gap-4 ps-3 pb-11 md:ps-6 lg:ps-9'>
        <div className='flex flex-col gap-2 md:hidden'>
          <Badge className='flex rounded-sm font-medium'>{version}</Badge>
          <div className='font-medium'>{date}</div>
        </div>
        {children}
      </div>
    </div>
  )
}

export default TimelineItem
