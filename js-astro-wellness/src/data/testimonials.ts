export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  initials: string;
}

export const testimonials: Testimonial[] = [
  {
    quote:
      'I joined for the classes and stayed for the coaching. Eighteen months in, I am stronger than I ever was in my twenties — and I actually look forward to training.',
    name: 'Sam Rivera',
    role: 'Member since 2025',
    initials: 'SR',
  },
  {
    quote:
      'After two kids and a long break from the gym, I was terrified of walking into a weight room again. The coaches scaled everything and never made it feel like a big deal.',
    name: 'Talia Bennett',
    role: 'Member since 2024',
    initials: 'TB',
  },
  {
    quote:
      'The recovery coaching changed more for me than any workout. I sleep better, my old back pain is gone, and I finally understand how to train without wrecking myself.',
    name: 'Marcus Cole',
    role: 'Member since 2026',
    initials: 'MC',
  },
];