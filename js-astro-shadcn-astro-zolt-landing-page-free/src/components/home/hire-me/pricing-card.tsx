import { ArrowRightIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

const FEATURES = [
  'One request at a time',
  'Avg. 48 hour turnaround',
  'Unlimited revisions',
  'Design + code delivered',
  'Up to 2 stakeholders'
]

const PricingCard = ({ className }: { className?: string }) => {
  return (
    <Card className={cn('bg-background rounded-2xl border py-6', className)}>
      <CardContent className='space-y-6 px-6'>
        <div className='space-y-2.5'>
          <p className='text-foreground text-2xl font-medium lg:text-[30px]'>Monthly Retainer</p>
          <p className='text-muted-foreground mb-0 text-base'>One design engineer dedicated to your product.</p>
          <p className='text-muted-foreground text-base'>
            I design it, build it, and ship it - start to finish, no middleman.
          </p>
        </div>

        <Separator />

        <Badge variant='secondary' className='text-foreground h-6.5 rounded-full bg-(--background-darker) font-normal'>
          Pause or cancel anytime
        </Badge>

        <p className='text-foreground mb-5.5 text-4xl font-semibold sm:text-5xl'>
          $1,900 <span className='text-muted-foreground -ml-3 text-xl font-medium lg:text-[30px]'>/month</span>
        </p>

        <ul className='mb-5.5 grid grid-cols-2 gap-x-4 gap-y-2'>
          {FEATURES.map(feature => (
            <li key={feature} className='text-foreground flex items-center gap-2 text-base font-medium'>
              <span className='bg-foreground size-1.5 shrink-0 rounded-full' />
              {feature}
            </li>
          ))}
        </ul>

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
      </CardContent>
    </Card>
  )
}

export default PricingCard
