import { ArrowRightIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardTitle, CardDescription, CardHeader } from '@/components/ui/card'

type NewItem = {
  img: string
  alt: string
  title: string
  description: string
  blogLink: string
}[]

const NewItems = ({ newItems }: { newItems: NewItem }) => {
  return (
    <section id='new-items' className='py-8 sm:py-16 lg:py-24'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mx-auto mb-12 flex max-w-2xl flex-col items-center justify-center space-y-4 text-center sm:mb-16 lg:mb-24'>
          <Badge variant='outline' className='h-auto text-sm font-normal'>
            New Items
          </Badge>
          <h2 className='text-2xl font-semibold md:text-3xl lg:text-4xl'>Fresh menu items</h2>
          <p className='text-muted-foreground text-xl'>
            Explore our most recent additions to the menu. Each dish is designed to delight your taste buds and provide
            a memorable dining experience.
          </p>
        </div>

        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {newItems.map((item, index) => (
            <Card
              className='hover:border-primary border-primary/10 rounded-none border pt-0 shadow-none ring-0 transition-colors duration-300 max-lg:last:col-span-full'
              key={index}
            >
              <CardContent className='px-0'>
                <img src={item.img} alt={item.alt} className='aspect-video h-60 w-full object-cover' />
              </CardContent>
              <CardHeader className='mb-2 gap-3'>
                <CardTitle className='text-xl font-semibold'>
                  <a href='#'>{item.title}</a>
                </CardTitle>
                <CardDescription className='text-base'>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className='group bg-primary/10 hover:bg-primary/20 text-primary rounded-full text-sm has-[>svg]:px-6'
                  size='lg'
                  asChild
                >
                  <a href={item.blogLink}>
                    Full menu
                    <ArrowRightIcon className='transition-transform duration-200 group-hover:translate-x-0.5' />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default NewItems
