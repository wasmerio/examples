import { Card, CardContent } from '@/components/ui/card'

import ContactForm from '@/components/blocks/contact-us/contact-form'

const ContactUs = () => {
  return (
    <section className='bg-muted py-8 sm:py-16 lg:h-dvh lg:py-32'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='mb-12 space-y-4 text-center sm:mb-16'>
          <h2 className='text-2xl font-semibold md:text-3xl lg:text-4xl'>Get in touch with us for more information</h2>
          <p className='text-muted-foreground text-xl'>
            Contact us for inquiries or support we&apos;re here to help and ensure an exceptional experience.
          </p>
        </div>

        <Card className='shadow-none ring-0'>
          <CardContent className='grid gap-6 md:grid-cols-4 md:gap-12'>
            {/* Form Section */}
            <div className='md:col-span-2'>
              <ContactForm />
            </div>

            <div className='shadow-none md:col-span-2'>
              <img
                src='/images/contact-us.webp'
                alt='Contact illustration'
                className='size-full rounded-xl border object-cover max-md:max-h-70'
                loading='lazy'
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export default ContactUs
