import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import type { ContactFormValues } from '@/components/contact/contact-form/contact-form-schema'
import { contactFormSchema, SERVICE_OPTIONS } from '@/components/contact/contact-form/contact-form-schema'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup } from '@/components/ui/select'

import { cn } from '@/lib/utils'

const SERVICE_ITEMS = SERVICE_OPTIONS.map(option => ({ label: option, value: option }))

type ContactFormProps = {
  className?: string
}

const ContactForm = ({ className }: ContactFormProps) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      service: '',
      message: ''
    }
  })

  const onSubmit = (values: ContactFormValues) => {
    void values
    toast.success("Message sent — I'll get back to you as soon as possible.")
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn(className)}>
      <FieldGroup>
        <Field data-invalid={!!errors.name} className='gap-1'>
          <FieldLabel htmlFor='contact-name' className='text-muted-foreground text-base'>
            Name*
          </FieldLabel>
          <Input
            id='contact-name'
            placeholder='John doe'
            aria-invalid={!!errors.name}
            className='border-border h-11 rounded-[12px] bg-(--background-darker)'
            {...register('name')}
          />
          <FieldError errors={errors.name ? [errors.name] : undefined} />
        </Field>

        <Field data-invalid={!!errors.email} className='gap-1'>
          <FieldLabel htmlFor='contact-email' className='text-muted-foreground text-base'>
            Email*
          </FieldLabel>
          <Input
            id='contact-email'
            type='email'
            placeholder='john@framer.com'
            aria-invalid={!!errors.email}
            className='border-border h-11 rounded-[12px] bg-(--background-darker)'
            {...register('email')}
          />
          <FieldError errors={errors.email ? [errors.email] : undefined} />
        </Field>

        <Field data-invalid={!!errors.service} className='gap-1'>
          <FieldLabel htmlFor='contact-service' className='text-muted-foreground text-base'>
            Service*
          </FieldLabel>
          <Controller
            control={control}
            name='service'
            render={({ field }) => (
              <Select
                items={SERVICE_ITEMS}
                value={field.value || null}
                onValueChange={value => field.onChange(value ?? '')}
              >
                <SelectTrigger
                  id='contact-service'
                  className='border-border h-11! w-full rounded-[12px] bg-(--background-darker)'
                >
                  <SelectValue placeholder='Select a service' />
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false}>
                  <SelectGroup>
                    {SERVICE_ITEMS.map(item => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          <FieldError errors={errors.service ? [errors.service] : undefined} />
        </Field>

        <Field data-invalid={!!errors.message} className='gap-1'>
          <FieldLabel htmlFor='contact-message' className='text-muted-foreground text-base'>
            Message
          </FieldLabel>
          <Textarea
            id='contact-message'
            placeholder='Enter your message'
            aria-invalid={!!errors.message}
            className='border-border min-h-25 rounded-[12px] bg-(--background-darker)'
            {...register('message')}
          />
          <FieldError errors={errors.message ? [errors.message] : undefined} />
        </Field>

        <Button
          type='submit'
          variant='outline'
          className='hover:bg-card hover:text-accent bg-card h-10 w-full rounded-[12px]'
        >
          Submit
        </Button>
      </FieldGroup>
    </form>
  )
}

export default ContactForm
