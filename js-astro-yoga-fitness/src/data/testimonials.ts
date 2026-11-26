import type { Testimonial } from '../types';

// Sample stories for the demo. Replace with real, permission-granted member quotes.
export const testimonials: Testimonial[] = [
  {
    quote:
      'Years at a desk left my shoulders locked tight. Six weeks of evening classes and I finally sleep without waking up stiff. The coaches notice every small detail.',
    name: 'Priya Nair',
    role: 'Product Designer',
    image: { src: '/images/story-01.webp', alt: 'Woman balancing in tree pose on a mat in a softly lit room' },
  },
  {
    quote:
      'I came for the stretching and stayed for the breathwork. My anxiety is quieter now, and I have tools I actually use on the hard days.',
    name: 'Daniel Brooks',
    role: 'Nurse Practitioner',
    image: { src: '/images/story-02.webp', alt: 'Students leaning into a side stretch during a busy studio class' },
  },
  {
    quote:
      'As a runner I was always nursing an injury. The mobility sessions rebuilt my hips and I just finished my first half marathon without pain.',
    name: 'Elena Ruiz',
    role: 'Marathon Runner',
    image: { src: '/images/story-03.webp', alt: 'Silhouette of a runner against a golden sunrise' },
  },
];
