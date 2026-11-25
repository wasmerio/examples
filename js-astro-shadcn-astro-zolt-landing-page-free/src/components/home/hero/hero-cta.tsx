import { ArrowRightIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

const HeroCta = () => {
  return (
    <div className='flex items-center gap-2.5 pt-2'>
      <Button
        variant='outline'
        className='hover:bg-background dark:bg-background hover:text-accent h-11 rounded-full px-4 text-base'
        render={<a href='#' />}
        nativeButton={false}
      >
        Download CV
      </Button>
      <Button
        variant='outline'
        className='hover:bg-card bg-card dark:bg-card hover:text-accent group/button h-11 gap-2.5 rounded-full pr-4 pl-4 text-base shadow-sm transition-[padding] duration-300 hover:pl-2'
        render={
          <a href='/#select-service'>
            <span className='bg-accent relative flex size-2.5 items-center justify-center overflow-hidden rounded-full transition-all duration-300 group-hover/button:size-6.5'>
              <ArrowRightIcon className='text-accent-foreground absolute size-4.5 -translate-x-3 opacity-0 transition-all duration-300 group-hover/button:translate-x-0 group-hover/button:opacity-100' />
            </span>
            Let&apos;s connect
          </a>
        }
        nativeButton={false}
      />
    </div>
  )
}

export default HeroCta
