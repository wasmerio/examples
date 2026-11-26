import type { Coach } from '../types';

// Optional: add `bio: '…'` to show a short line under the role.
// Replace the social URLs with each coach's real profiles (or remove them).
export const coaches: Coach[] = [
  {
    name: 'Maya Collins',
    role: 'Prenatal & Hatha',
    image: { src: '/images/coach-01.webp', alt: 'Maya Collins seated in a gentle twist on a mat by the sea' },
    socials: [
      { label: 'Maya on Instagram', href: 'https://www.instagram.com/', icon: 'camera' },
      { label: 'Maya on YouTube', href: 'https://www.youtube.com/', icon: 'play' },
    ],
  },
  {
    name: 'Arjun Mehta',
    role: 'Power & Vinyasa',
    image: { src: '/images/coach-02.webp', alt: 'Arjun Mehta balancing in crow pose on a sandy beach' },
    socials: [
      { label: 'Arjun on Instagram', href: 'https://www.instagram.com/', icon: 'camera' },
      { label: 'Arjun on YouTube', href: 'https://www.youtube.com/', icon: 'play' },
    ],
  },
  {
    name: 'Sofia Lindqvist',
    role: 'Meditation & Breathwork',
    image: { src: '/images/coach-03.webp', alt: 'Sofia Lindqvist meditating cross-legged with eyes closed' },
    socials: [
      { label: 'Sofia on Instagram', href: 'https://www.instagram.com/', icon: 'camera' },
      { label: 'Sofia on YouTube', href: 'https://www.youtube.com/', icon: 'play' },
    ],
  },
  {
    name: 'Walter Greene',
    role: 'Yin & Restorative',
    image: { src: '/images/coach-04.webp', alt: 'Walter Greene meditating on a red rock ledge above a canyon' },
    socials: [
      { label: 'Walter on Instagram', href: 'https://www.instagram.com/', icon: 'camera' },
      { label: 'Walter on YouTube', href: 'https://www.youtube.com/', icon: 'play' },
    ],
  },
];
