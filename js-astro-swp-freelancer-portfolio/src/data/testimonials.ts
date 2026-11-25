import type { Testimonial } from '~/types';

export const testimonials: Testimonial[] = [
  {
    quote:
      'We briefed three studios before this one. Robin spent the first week inside our support inbox rather than a design file, then showed us the two screens costing us signups. Setup completion moved forty-four points.',
    name: 'Priya Raghunathan',
    role: 'Co-founder, Brightsill',
    avatar: '/images/avatar-02.webp',
    avatarAlt: 'Portrait of Priya Raghunathan',
    rating: 5,
  },
  {
    quote:
      'The handover is the part that surprised me. Our two engineers built the entire marketing site from the component library in eight days and never once had to send a message about it.',
    name: 'Tomas Berger',
    role: 'CTO, Coalfield',
    avatar: '/images/avatar-01.webp',
    avatarAlt: 'Portrait of Tomas Berger',
    rating: 5,
  },
  {
    quote:
      'Fixed price, weekly demos, and in week two we were told to cut a feature rather than design it. That single conversation saved us a full quarter of engineering.',
    name: 'Elena Marchetti',
    role: 'Head of Product, Petrichor',
    avatar: '/images/avatar-03.webp',
    avatarAlt: 'Portrait of Elena Marchetti',
    rating: 5,
  },
];

export const testimonialsHeading = {
  eyebrow: 'In their words',
  title: 'What clients say once the invoice is paid.',
};
