import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'

type PopularDish = {
  image: string
  alt: string
  name: string
  type: string
  description: string
}[]

const PopularDishes = ({ popularDishes }: { popularDishes: PopularDish }) => {
  return (
    <section id='popular-dishes' className='py-8 sm:py-16 lg:py-24'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='mx-auto mb-12 flex max-w-2xl flex-col items-center justify-center space-y-4 text-center sm:mb-16 lg:mb-24'>
          <Badge variant='outline' className='h-auto text-sm font-normal'>
            Popular Dishes
          </Badge>
          <h2 className='text-2xl font-semibold md:text-3xl lg:text-4xl'>Favorite meals</h2>
          <p className='text-muted-foreground text-xl'>
            Discover our most loved creations crafted with passion, fresh ingredients, and bold flavours that keep
            guests coming back for more.
          </p>
        </div>

        {/* Dishes */}
        <div className='grid gap-6 md:grid-cols-2 lg:gap-y-10 xl:grid-cols-4'>
          {popularDishes.map((member, index) => (
            <Card
              key={index}
              className='hover:border-primary border-primary/10 overflow-hidden rounded-none border py-0 shadow-none ring-0 transition-colors duration-300'
            >
              <CardContent className='px-0'>
                <div className='bg-muted'>
                  <img src={member.image} alt={member.alt} className='h-auto w-full' />
                </div>
                <div className='space-y-3 px-6 py-5'>
                  <CardTitle className='text-lg font-semibold'>{member.name}</CardTitle>
                  <Separator />
                  <div className='text-muted-foreground'>
                    <p className='mb-1 text-base font-medium'>{member.type}</p>
                    <p className='text-base'>{member.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PopularDishes
