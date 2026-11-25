'use client'

import { UserIcon, MailIcon, PhoneIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const ContactForm = () => {
  return (
    <form className='space-y-6' onSubmit={e => e.preventDefault()}>
      {/* Name Input */}
      <div className='space-y-2'>
        <Label htmlFor='username'>Your Name</Label>
        <div className='relative'>
          <Input id='username' type='text' placeholder='Enter your name here...' className='peer input-lg pr-9 pl-3' />
          <div className='text-muted-foreground pointer-events-none absolute inset-y-0 right-0 flex items-center justify-center pr-3 peer-disabled:opacity-50'>
            <UserIcon className='size-4' />
            <span className='sr-only'>Name</span>
          </div>
        </div>
      </div>

      {/* Email Input */}
      <div className='space-y-2'>
        <Label htmlFor='email'>Your Email</Label>
        <div className='relative'>
          <Input id='email' type='email' placeholder='Enter your email here...' className='peer input-lg px-3 pr-9' />
          <div className='text-muted-foreground pointer-events-none absolute inset-y-0 right-0 flex items-center justify-center pr-3 peer-disabled:opacity-50'>
            <MailIcon className='size-4' />
            <span className='sr-only'>Email</span>
          </div>
        </div>
      </div>

      {/* Subject Input */}
      <div className='space-y-2'>
        <Label htmlFor='subject'>Phone Number</Label>
        <div className='relative'>
          <Input
            id='subject'
            type='text'
            placeholder='Enter your phone number here...'
            className='peer input-lg px-3 pr-9'
          />
          <div className='text-muted-foreground pointer-events-none absolute inset-y-0 right-0 flex items-center justify-center pr-3 peer-disabled:opacity-50'>
            <PhoneIcon className='size-4' />
            <span className='sr-only'>Phone</span>
          </div>
        </div>
      </div>

      {/* Message Input */}
      <div className='space-y-2'>
        <Label htmlFor='message'>Message</Label>
        <Textarea id='message' className='h-28 resize-none px-3' placeholder='Enter your message' />
      </div>

      {/* Submit Button */}
      <Button type='submit' size='lg' className='w-full text-base'>
        Send Your Message
      </Button>
    </form>
  )
}

export default ContactForm
