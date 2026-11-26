import type { Testimonial } from '../types';

/** Fictional demo testimonial. The homepage shows the first entry. */
export const testimonials: Testimonial[] = [
  {
    quote:
      'They spent the first week watching us work instead of talking about models. The agent they built behaves like someone who has actually sat on the dispute desk.',
    name: 'Dana Whitlock',
    role: 'Head of Operations',
    company: 'Meridian Bank',
    image: '/images/testimonial-portrait.webp',
    imageAlt: 'Portrait of Dana Whitlock',
    link: { label: 'Read the case study', href: '/#work' },
  },
];
