import { z } from 'zod'

export const SERVICE_OPTIONS = [
  'UI & Product Design',
  'Design Engineering',
  'Framer Development',
  'Design Systems',
  'Interaction & Motion Design'
] as const

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Enter a valid email address.'),
  service: z.string().min(1, 'Please select a service.'),
  message: z.string().min(10, 'Message must be at least 10 characters.')
})

export type ContactFormValues = z.infer<typeof contactFormSchema>
