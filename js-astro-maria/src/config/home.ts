export const hero = {
  greeting: "Hi, I'm Maria.",
  title: 'I design digital products that',
  highlight: 'actually make sense.',
  text: 'Ten-plus years helping teams turn messy problems into clear, useful experiences. Corporations, startups, scrappy independents: if there is a user confused somewhere, I want to fix that.',
  primary: { label: 'See selected work', href: '/#work' },
  secondary: { label: 'About me', href: '/about/' },
  facts: [
    { value: '10+', label: 'years in product design' },
    { value: '40+', label: 'products shipped' },
    { value: '12', label: 'design systems built' },
  ],
};

export const work = {
  eyebrow: 'Selected work',
  title: 'Case studies',
  text: 'A few projects where clarity was the whole job: dense workflows, high stakes, and people who needed the product to get out of the way.',
  /** How many featured case studies the homepage shows. */
  limit: 4,
};

export const services = {
  eyebrow: 'What I do',
  title: 'From fuzzy brief to shipped product',
  items: [
    {
      icon: 'lightbulb',
      title: 'Product strategy',
      text: 'Framing the real problem, mapping what users need first, and deciding what not to build.',
    },
    {
      icon: 'workflow',
      title: 'UX and flows',
      text: 'Research, journeys, and information architecture for workflows that carry real weight.',
    },
    {
      icon: 'layers',
      title: 'Design systems',
      text: 'Tokens, components, and documentation that keep a growing product coherent.',
    },
    {
      icon: 'pen-tool',
      title: 'Interface craft',
      text: 'High-fidelity UI, prototypes, and handoff details that survive contact with engineering.',
    },
  ],
};

export const testimonials = {
  eyebrow: 'Kind words',
  title: 'What teams say',
  items: [
    {
      quote:
        'Maria took a dashboard our users tolerated and made it the part of the product they open first. She asked the questions nobody else on the team was asking.',
      name: 'Daniel Brooks',
      role: 'Head of Product, Nextpoint',
    },
    {
      quote:
        'She has a rare way of making complicated systems feel calm. Our caseworkers stopped asking for training after the redesign shipped.',
      name: 'Priya Shah',
      role: 'Director of Operations, b.combs',
    },
    {
      quote:
        'Equal parts strategist and craftsperson. Every review with Maria left us with fewer screens and a clearer product.',
      name: 'Lukas Weber',
      role: 'Founder, Nestara',
    },
  ],
};

export const closing = {
  eyebrow: "Let's work together",
  title: 'Got something worth building?',
  highlight: "Let's talk.",
  text: 'I take on a few product design engagements each quarter, from a focused audit to a full redesign. Tell me what you are working on.',
};
