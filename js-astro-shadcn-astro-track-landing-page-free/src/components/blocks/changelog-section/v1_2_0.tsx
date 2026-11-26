import TimelineItem from '@/components/timeline/timeline-items'
import Accordion from '@/components/badge-accordion/badge-accordion'
import CopyCode from '@/components/blocks/copy-code-block/copy-code-block'
import { accordionDataV1_2_0 } from '@/components/sections/changelog-data'

function v1_2_0() {
  return (
    <div>
      <TimelineItem date='March 22, 2025' version='v 1.2.0'>
        <div className='space-y-4'>
          <h3 className='text-xl font-semibold'>Studio Dashboard Live Preview & Deployment</h3>
          <p className='text-muted-foreground text-sm'>
            The new Studio Dashboard brings together everything you need to preview, test, and deploy your component
            library right from your browser.
          </p>
          <div className='space-y-3'>
            <ul className='text-muted-foreground list-inside list-disc space-y-3 text-sm'>
              <li>Preview components in any framework (Next.js, Remix, Vite)</li>
              <li>One-click deploy to Vercel</li>
              <li>Real-time preview links for teams</li>
            </ul>
            <div className='fle-wrap flex items-center gap-4'>
              {/* vite */}
              <div className='flex items-center gap-1.5 rounded-md bg-amber-600/10 px-3 py-1 dark:bg-amber-400/10'>
                <img src='/images/vite-logo.webp' alt='Vite' className='h-4.5' loading='lazy' />
                <span className='text-xs font-medium'>Vite</span>
              </div>
              {/* React */}
              <div className='flex items-center gap-1.5 rounded-md bg-sky-600/10 px-3 py-1 dark:bg-sky-400/10'>
                <img src='/images/react-logo.webp' alt='React' className='h-4.5' loading='lazy' />
                <span className='text-xs font-medium'>React</span>
              </div>
              {/* Angular */}
              <div className='bg-destructive/10 flex items-center gap-1.5 rounded-md px-3 py-1'>
                <img src='/images/angular-logo.webp' alt='Angular' className='h-4.5' loading='lazy' />
                <span className='text-xs font-medium'>Angular</span>
              </div>
            </div>
          </div>
          <CopyCode />
          <p className='text-muted-foreground text-sm'>
            The Studio Dashboard is a powerful tool within shadcnstudio that streamlines the process of designing,
            previewing, and deploying your component library. It allows you to instantly preview components in different
            frameworks (like Next.js, Remix, and Vite) directly from the dashboard.
          </p>
          <Accordion data={accordionDataV1_2_0} />
        </div>
      </TimelineItem>
    </div>
  )
}

export default v1_2_0
