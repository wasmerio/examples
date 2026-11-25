import { Badge } from '@/components/ui/badge'

import { cn } from '@/lib/utils'

type ExperienceTimelineItemProps = {
  logo: string
  company: string
  role: string
  period: string
  status?: { text: string; tone: 'positive' | 'accent' }
  stack: string[]
  achievement: string
  description: string
}

const ExperienceTimelineItem = ({
  logo,
  company,
  role,
  period,
  status,
  stack,
  achievement,
  description
}: ExperienceTimelineItemProps) => {
  return (
    <div className='space-y-4'>
      <div className='mb-6 flex items-center gap-3'>
        <div className='bg-card flex size-13.5 shrink-0 items-center justify-center rounded-md sm:size-14'>
          <img src={logo} alt={`${company} logo`} className='size-11.5' />
        </div>
        <div>
          <p className='text-muted-foreground'>{company}</p>
          <h3 className='text-lg font-medium sm:text-[26px] sm:leading-8'>{role}</h3>
        </div>
      </div>

      <div className='mb-1.5 space-y-3 text-sm sm:text-base'>
        <p className='flex items-center gap-2'>
          <img src='/images/experience/calendar.webp' alt='calendar' className='size-6' />
          <span className='text-base'>
            {period}
            {status && (
              <span
                className={cn(
                  'ml-1 font-medium',
                  status.tone === 'positive' ? 'text-green-600 dark:text-green-400' : 'text-accent'
                )}
              >
                {status.text}
              </span>
            )}
          </span>
        </p>

        <div className='flex flex-wrap items-center gap-2'>
          <img src='/images/experience/medal.webp' alt='Medal' className='size-6' />
          {stack.map(tech => (
            <Badge
              key={tech}
              variant='secondary'
              className='text-foreground h-5.5 rounded-full bg-(--background-darker)'
            >
              {tech}
            </Badge>
          ))}
        </div>

        <p className='flex items-start gap-2 font-medium'>
          <img src='/images/experience/speaker.webp' alt='speaker' className='size-6' />
          <span className='text-base font-medium'>{achievement}</span>
        </p>
      </div>

      <p className='text-muted-foreground ml-8 max-w-145'>{description}</p>
    </div>
  )
}

export default ExperienceTimelineItem
