// SAMPLE CONTENT – replace every string with your own business details.
export const en = {
  meta: {
    title: 'Studio Exemplo – sample landing page for local services',
    description:
      'Sample bilingual landing page for a clinic, salon, studio or consultant. Replace this description with what your business does and where.',
  },
  a11y: { skip: 'Skip to content', menu: 'Menu', theme: 'Toggle dark mode', language: 'Language' },
  nav: { services: 'Services', about: 'About', pricing: 'Pricing', faq: 'FAQ', contact: 'Contact' },
  hero: {
    badge: 'Sample content – edit src/i18n/en.ts',
    title: 'Friendly, on-time care for your neighbourhood',
    subtitle:
      'This is placeholder text for a local business. Say who you help, what you do and why people choose you, in one or two short sentences.',
    primary: 'Book on WhatsApp',
    secondary: 'See services',
    waMessage: 'Hi! I would like to book an appointment.',
    points: ['Appointments Mon–Sat', 'Easy online booking', 'English & Portuguese'],
  },
  services: {
    title: 'Services',
    subtitle: 'Three to six sample services. Keep each description short and concrete.',
    items: [
      { icon: 'calendar', title: 'First consultation', text: 'Sample service. Describe what happens, how long it takes and who it is for.' },
      { icon: 'sparkles', title: 'Signature treatment', text: 'Sample service. Mention the result a client can expect, without promising outcomes you cannot guarantee.' },
      { icon: 'heart', title: 'Follow-up sessions', text: 'Sample service. Explain the follow-up plan or package in plain language.' },
      { icon: 'home', title: 'Home visits', text: 'Sample service. Note the area you cover and any extra fee.' },
      { icon: 'chat', title: 'Online sessions', text: 'Sample service. List the tools you use, for example a video call or WhatsApp.' },
      { icon: 'shield', title: 'Packages & plans', text: 'Sample service. Monthly plans, gift cards or corporate packages.' },
    ],
  },
  about: {
    title: 'About us',
    text: [
      'Placeholder story. Tell visitors who runs the business, how long you have been working in this field and what makes your approach different.',
      'Add your credentials or registrations here (for example a professional licence number) only if they are real and current.',
    ],
    facts: [
      { label: 'Location', value: 'Your City, State' },
      { label: 'Opening hours', value: 'Mon–Fri 9:00–18:00 · Sat 9:00–13:00' },
      { label: 'Languages', value: 'English, Portuguese' },
    ],
  },
  pricing: {
    title: 'Pricing',
    subtitle: 'Sample prices – replace them with your own.',
    popular: 'Most chosen',
    cta: 'Ask on WhatsApp',
    plans: [
      { name: 'Single visit', price: '$40', period: 'per session', features: ['One session', 'Up to 50 minutes', 'Notes by email'] },
      { name: 'Monthly plan', price: '$140', period: 'per month', features: ['Four sessions', 'Priority booking', 'WhatsApp support'], featured: true },
      { name: 'Custom', price: 'Quote', period: 'on request', features: ['Groups or companies', 'Flexible schedule', 'Invoice available'] },
    ],
  },
  testimonials: {
    title: 'What clients say',
    note: 'Placeholder – add real reviews only, with the client’s permission.',
    items: [
      { quote: 'Your first real client review goes here.', name: 'Client name', role: 'Sample placeholder' },
      { quote: 'Your second real client review goes here.', name: 'Client name', role: 'Sample placeholder' },
      { quote: 'Your third real client review goes here.', name: 'Client name', role: 'Sample placeholder' },
    ],
  },
  faq: {
    title: 'Frequently asked questions',
    items: [
      { q: 'How do I book?', a: 'Sample answer. Tap the WhatsApp button and send the prefilled message, or email us. We reply during opening hours.' },
      { q: 'Which payment methods do you accept?', a: 'Sample answer. List the methods you really accept, for example Pix, card or cash.' },
      { q: 'Can I cancel or reschedule?', a: 'Sample answer. State your policy, for example free changes up to 24 hours before.' },
      { q: 'Where are you located?', a: 'Sample answer. Give the neighbourhood, parking or public transport tips.' },
    ],
  },
  contact: {
    title: 'Ready to book?',
    text: 'Message us on WhatsApp or send an email. Replace these links in src/site.config.ts.',
    whatsapp: 'Chat on WhatsApp',
    email: 'Send an email',
    emailSubject: 'Appointment request',
  },
  footer: { rights: 'All rights reserved.', made: 'Built with Astro & Tailwind CSS · Balcão theme' },
};

export type Dict = typeof en;
