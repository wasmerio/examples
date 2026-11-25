import Eyebrow from '@/components/shared/eyebrow/eyebrow'
import ProfileShowcase from '@/components/shared/profile-showcase'
import ContactForm from '@/components/contact/contact-form/contact-form'

const ContactHero = () => {
  return (
    <section className='border-b py-8 sm:py-16 lg:py-24'>
      <div className='mx-auto max-w-245 space-y-10 px-4 sm:px-6 lg:space-y-16 lg:px-10.5'>
        <div className='max-w-2xl space-y-2'>
          <Eyebrow>Contact me</Eyebrow>
          <h1 className='text-2xl font-semibold sm:text-3xl lg:text-[36px]'>
            <span className='max-md:hidden'>Feel free to send me a message,</span>{' '}
            <span className='text-nowrap max-md:hidden'>I will get back to you as soon as possible.</span>
            <span className='md:hidden'>
              Feel free to send me a message, I will get back to you as soon as possible.
            </span>
          </h1>
        </div>

        <div className='grid gap-8 lg:grid-cols-2 lg:items-start'>
          <ContactForm className='order-2 lg:order-1' />

          <ProfileShowcase
            className='order-1 mx-auto max-h-130 w-full lg:order-2'
            backgroundImageClassName='max-h-93.5 w-full'
            profileImageClassName='max-w-105'
          />
        </div>
      </div>
    </section>
  )
}

export default ContactHero
