import { useState } from 'react'
import type { FormEvent } from 'react'

import { format } from 'date-fns'
import { toast } from 'sonner'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

type DetailsStepProps = {
  service: { title: string; price: string; duration: string } | undefined
  date: Date | undefined
  time: string | null
  onSuccess: (name: string) => void
}

const DetailsStep = ({ service, date, time, onSuccess }: DetailsStepProps) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    toast.success("Appointment booked — I'll send a confirmation email shortly.")
    onSuccess(name)
    setName('')
    setEmail('')
    setNotes('')
  }

  const serviceValue = service ? `${service.title} · ${service.duration}` : '—'
  const dateTimeValue = date && time ? `${format(date, 'EEE, MMM d')} · ${time}` : '—'
  const priceValue = service?.price ?? '—'

  return (
    <div className='space-y-4'>
      <div className='space-y-3 rounded-xl bg-(--background-darker) p-4'>
        <div className='flex items-start gap-2'>
          <span className='bg-accent mt-1.5 size-2.5 shrink-0 rounded-full' />
          <div>
            <p className='text-muted-foreground text-[10px] tracking-wide uppercase'>Service</p>
            <p className='text-sm font-semibold'>{serviceValue}</p>
          </div>
        </div>

        <div className='flex items-start gap-2'>
          <span className='mt-1.5 size-2.5 shrink-0 rounded-full bg-sky-600' />
          <div>
            <p className='text-muted-foreground text-[10px] tracking-wide uppercase'>Date & Time</p>
            <p className='text-sm'>{dateTimeValue}</p>
          </div>
        </div>

        <div className='flex items-start gap-2'>
          <span className='bg-accent mt-1.5 size-2.5 shrink-0 rounded-full' />
          <div>
            <p className='text-muted-foreground text-[10px] tracking-wide uppercase'>Price</p>
            <p className='text-accent text-sm font-bold'>{priceValue}</p>
          </div>
        </div>
      </div>

      <form id='details-form' onSubmit={handleSubmit} className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='details-name'>Full Name *</Label>
          <Input
            id='details-name'
            placeholder='Your name'
            className='h-14.5 rounded-[16px] px-4.5 focus-visible:ring-0'
            required
            value={name}
            onChange={event => setName(event.target.value)}
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='details-email'>Email Address *</Label>
          <Input
            id='details-email'
            type='email'
            placeholder='you@example.com'
            className='h-14.5 rounded-[16px] px-4.5 focus-visible:ring-0'
            required
            value={email}
            onChange={event => setEmail(event.target.value)}
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='details-notes'>Notes (optional)</Label>
          <Textarea
            id='details-notes'
            placeholder='Any special requests...'
            className='min-h-20 resize-none rounded-[16px] px-4.5 focus-visible:ring-0'
            value={notes}
            onChange={event => setNotes(event.target.value)}
          />
        </div>
      </form>
    </div>
  )
}

export default DetailsStep
