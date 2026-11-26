import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'

type AccordionItem = {
  type: string
  items: string[]
  badges?: string[]
}

type BadgeAccordionProps = {
  data: AccordionItem[]
}

const BadgeAccordion = ({ data }: BadgeAccordionProps) => {
  const getBadgeProps = (type: string) => {
    switch (type) {
      case 'new':
        return {
          className:
            'border-none h-6 rounded-sm bg-green-600/10 text-green-600 focus-visible:ring-green-600/20 focus-visible:outline-none dark:bg-green-400/10 dark:text-green-400 dark:focus-visible:ring-green-400/40 [a&]:hover:bg-green-600/5 dark:[a&]:hover:bg-green-400/5',
          dotColor: 'bg-green-600 dark:bg-green-400',
          label: 'New'
        }
      case 'updates':
        return {
          className:
            'border-none h-6 rounded-sm bg-sky-600/10 text-sky-600 focus-visible:ring-sky-600/20 focus-visible:outline-none dark:bg-sky-400/10 dark:text-sky-400 dark:focus-visible:ring-sky-400/40 [a&]:hover:bg-sky-600/5 dark:[a&]:hover:bg-sky-400/5',
          dotColor: 'bg-sky-600 dark:bg-sky-400',
          label: 'Updates'
        }
      case 'bugfixes':
        return {
          className:
            'border-none h-6 rounded-sm bg-amber-600/10 text-amber-600 focus-visible:ring-amber-600/20 focus-visible:outline-none dark:bg-orange-400/10 dark:text-orange-400 dark:focus-visible:ring-orange-400/40 [a&]:hover:bg-amber-600/5 dark:[a&]:hover:bg-orange-400/5',
          dotColor: 'bg-amber-600 dark:bg-amber-400',
          label: 'Bug Fixes'
        }
      default:
        return {
          className:
            'border-none h-6 rounded-sm bg-green-600/10 text-green-600 focus-visible:ring-green-600/20 focus-visible:outline-none dark:bg-green-400/10 dark:text-green-400 dark:focus-visible:ring-green-400/40 [a&]:hover:bg-green-600/5 dark:[a&]:hover:bg-green-400/5',
          dotColor: 'bg-green-600 dark:bg-green-400',
          label: 'New'
        }
    }
  }

  return (
    <Accordion type='multiple' className='-mt-4 mb-0 w-full' defaultValue={['item-1']}>
      {data.map((item, index) => {
        const badgeProps = getBadgeProps(item.type)

        return (
          <AccordionItem key={index} value={`item-${index + 1}`}>
            <AccordionTrigger className='px-0 hover:no-underline [&>svg]:size-6!'>
              <Badge className={badgeProps.className}>{badgeProps.label}</Badge>
            </AccordionTrigger>
            <AccordionContent className='text-muted-foreground'>
              <ul className='text-muted-foreground list-inside list-disc space-y-3 text-sm'>
                {item.items.map((listItem, listIndex) => (
                  <li key={listIndex}>{listItem}</li>
                ))}
              </ul>
              {item.badges && (
                <div className='mt-4 flex flex-wrap items-center gap-2'>
                  {item.badges.map((badge, badgeIndex) => (
                    <div key={badgeIndex} className='bg-primary/10 text-destructive rounded-md px-3 py-1 text-xs'>
                      {badge}
                    </div>
                  ))}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}

export default BadgeAccordion
