import { Card, CardContent } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

import { cn } from '@/lib/utils'

const CONTRIBUTION_LEVEL_STYLES = [
  'bg-background',
  'bg-[#9be9a8] dark:bg-[#0e4429]',
  'bg-[#40c463] dark:bg-[#006d32]',
  'bg-[#30a14e] dark:bg-[#26a641]',
  'bg-[#216e39] dark:bg-[#39d353]'
]

const CONTRIBUTION_LEVEL_COUNTS = [0, 1, 3, 5, 8]

const CONTRIBUTION_ROWS = 6
const CONTRIBUTION_COLUMNS = 39
const TOTAL_CONTRIBUTION_CELLS = CONTRIBUTION_ROWS * CONTRIBUTION_COLUMNS
const LATEST_CONTRIBUTION_DATE = new Date(2024, 3, 30)

// Weighted so most cells stay empty, like a real contribution graph
const CONTRIBUTION_LEVEL_WEIGHTS = [40, 25, 20, 10, 5]

const getRandomContributionLevel = () => {
  const roll = Math.random() * 100
  let cumulativeWeight = 0

  for (let level = 0; level < CONTRIBUTION_LEVEL_WEIGHTS.length; level++) {
    cumulativeWeight += CONTRIBUTION_LEVEL_WEIGHTS[level]
    if (roll < cumulativeWeight) return level
  }

  return CONTRIBUTION_LEVEL_WEIGHTS.length - 1
}

const buildContributionCell = (rowIndex: number, columnIndex: number) => {
  const level = getRandomContributionLevel()
  const chronologicalIndex = columnIndex * CONTRIBUTION_ROWS + rowIndex
  const daysAgo = TOTAL_CONTRIBUTION_CELLS - 1 - chronologicalIndex

  const date = new Date(LATEST_CONTRIBUTION_DATE)

  date.setDate(date.getDate() - daysAgo)

  return { level, count: CONTRIBUTION_LEVEL_COUNTS[level], date }
}

const CONTRIBUTION_GRID = Array.from({ length: CONTRIBUTION_ROWS }, (_, rowIndex) =>
  Array.from({ length: CONTRIBUTION_COLUMNS }, (_, columnIndex) => buildContributionCell(rowIndex, columnIndex))
)

const BRAND_LOGOS = Array.from({ length: 20 }, (_, index) => {
  const position = String(index + 1).padStart(2, '0')

  return { src: `/images/experience/img-${position}.webp`, alt: `Tech stack logo ${position}` }
})

const LOGO_ROWS = [BRAND_LOGOS.slice(0, 10), BRAND_LOGOS.slice(10)]

const ActivityCard = () => {
  return (
    <Card className='ring-border gap-6 rounded-3xl p-6 shadow-lg lg:mb-16'>
      <CardContent className='space-y-4 p-0'>
        <div>
          <p className='text-sm font-semibold'>@zolt_mercer</p>
          <p className='text-muted-foreground text-xs opacity-75'>864 contributions in the template timeline</p>
        </div>

        <div className='overflow-x-auto'>
          <TooltipProvider delay={0}>
            <div className='w-max space-y-1 lg:w-full'>
              {CONTRIBUTION_GRID.map((row, rowIndex) => (
                <div key={rowIndex} className='flex gap-1'>
                  {row.map((cell, columnIndex) => {
                    const dateLabel = cell.date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })

                    return (
                      <Tooltip key={columnIndex}>
                        <TooltipTrigger
                          render={
                            <span
                              className={cn(
                                'size-3.5 rounded-xs transition-transform duration-150 hover:scale-125 max-lg:shrink-0 sm:size-5',
                                CONTRIBUTION_LEVEL_STYLES[cell.level]
                              )}
                            />
                          }
                        />
                        <TooltipContent className='dark:text-primary bg-black font-medium [&>*:last-child]:hidden'>
                          <span className='font-semibold'>
                            {cell.count} contribution{cell.count === 1 ? '' : 's'}
                          </span>{' '}
                          on {dateLabel}
                        </TooltipContent>
                      </Tooltip>
                    )
                  })}
                </div>
              ))}
            </div>
          </TooltipProvider>
        </div>
      </CardContent>

      <div className='border-border -mx-6 border-t' />

      <div className='min-w-0 space-y-8'>
        {LOGO_ROWS.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className='overflow-hidden mask-[linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]'
          >
            <div
              className={cn(
                'flex w-max animate-[marquee_25s_linear_infinite] gap-8',
                rowIndex % 2 === 1 && 'direction-reverse'
              )}
            >
              {[...row, ...row].map((logo, logoIndex) => (
                <div
                  key={`${logo.src}-${logoIndex}`}
                  className='bg-background flex size-16 shrink-0 items-center justify-center rounded-md'
                >
                  <img src={logo.src} alt={logo.alt} className='size-10 grayscale' />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default ActivityCard
