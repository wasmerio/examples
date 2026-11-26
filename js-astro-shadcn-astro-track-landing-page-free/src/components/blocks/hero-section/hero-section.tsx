import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

function HeroSection() {
  return (
    <section id='home' className='-mt-17.5 pt-17.5'>
      <div className='space-y-4 px-4 py-8 text-center md:px-8 md:py-16'>
        <Badge className='h-auto text-sm font-normal' variant='outline'>
          Updates
        </Badge>
        <h2 className='text-2xl font-semibold md:text-3xl lg:text-4xl'>Changelog</h2>
        <p className='text-muted-foreground text-xl'>See what&apos;s new added, changed, fixed, improved or updated.</p>
        <div className='mx-auto flex max-w-sm gap-3 max-sm:flex-col max-sm:items-center'>
          <Input type='text' placeholder='Your email' className='bg-background input-lg px-3' />
          <Button type='submit' size='lg' className='rounded-lg text-base max-sm:w-full'>
            Subscribe
          </Button>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
