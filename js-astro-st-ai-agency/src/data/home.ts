import type { HeroStat, SectionHeading } from '../types';

/** Copy for the homepage hero. Line breaks in the headline are intentional. */
export const hero = {
  eyebrow: '14 agents live in production',
  /** Each entry is one line of the headline; `tint` lines use the light-peach accent. */
  headline: [
    { text: 'AI agents', tint: false },
    { text: 'that run', tint: false },
    { text: 'the work,', tint: true },
    { text: 'not the demo.', tint: true },
  ],
  lead: 'We build and run the agents that handle your support queue, your invoice runs and your claims desk — and hand back to a human the moment they should.',
  primaryCta: { label: 'Book a demo', href: '/#contact' },
  secondaryCta: { label: 'See our work', href: '/#work' },
  image: '/images/ai-agency-hero.webp',
  credentials: [
    { icon: 'clock', label: 'Always on' },
    { icon: 'shield-check', label: 'Fully audited' },
    { icon: 'bars', label: 'Measured against your baseline' },
  ] as const,
};

/** The four figures pinned to the bottom of the hero. Demo numbers — replace with your own. */
export const heroStats: HeroStat[] = [
  { value: '92%', label: 'Tier-1 tickets closed without a human' },
  { value: '6 weeks', label: 'From first workshop to live traffic' },
  { value: '4,200 hrs', label: 'Queue work moved off desks each month' },
  { value: '24/7', label: 'Shared on-call with your operations lead' },
];

export const clients = {
  label: 'Operating inside',
  /** Fictional company names used as a word-mark strip. */
  names: ['Northwind', 'Kestrel Health', 'Meridian', 'Halcyon', 'Orbit Retail', 'Palisade'],
};

export const sections: Record<
  'solutions' | 'platform' | 'process' | 'work' | 'sectors' | 'testimonial' | 'team' | 'pricing' | 'insights' | 'faq' | 'contact',
  SectionHeading
> = {
  solutions: {
    kicker: 'What we build',
    title: 'Five agents. One operating standard.',
    lead: 'Each one ships with its own evaluation set, spend cap and escalation rule. You get the agent, the harness around it, and the screen your team runs it from.',
  },
  platform: {
    kicker: 'How it holds up',
    title: 'Built to be handed<br>over, not rented.',
    lead: 'You own the code, the prompts, the test set and the infrastructure definitions from day one. We are the team that runs it until your team wants to.',
  },
  process: {
    kicker: 'How we work',
    title: 'Six weeks from<br>workshop to live.',
    lead: 'The order matters. We will not build before we have watched the work done by hand, and we will not launch before the test set passes.',
  },
  work: {
    kicker: 'Selected work',
    title: 'Twelve months<br>of receipts.',
    lead: 'Every number below is measured against the manual baseline we recorded in week one — not against a vendor benchmark.',
  },
  sectors: {
    kicker: 'Where we work',
    title: 'Sectors with rules worth respecting',
    lead: 'We take work in regulated and operationally heavy industries, because that is exactly where supervision earns its keep.',
  },
  testimonial: { kicker: 'Client voice', title: '' },
  team: {
    kicker: 'The team',
    title: 'Small on purpose',
    lead: 'Nine people. The person who scopes your engagement is the person who writes the test set and answers the pager.',
  },
  pricing: {
    kicker: 'Engagements',
    title: 'Priced by the agent, not by the seat',
    lead: 'A fixed monthly fee covering build, supervision and on-call. Model and infrastructure costs pass through at cost, itemised on every invoice.',
  },
  insights: {
    kicker: 'Insights',
    title: 'Notes from the run log',
    lead: 'What we learned shipping agents into places where a wrong answer costs real money.',
  },
  faq: {
    kicker: 'Questions',
    title: 'Before you<br>get in touch',
    lead: 'If yours is not here, ask it in the form below. We answer in writing before any call.',
  },
  contact: {
    kicker: 'Get in touch',
    title: 'Bring us one<br>annoying workflow',
    lead: 'Tell us the task your team dreads on a Monday. Within a week we will tell you whether an agent can hold it, what it would cost, and where it would break.',
  },
};

export const platformImage = {
  src: '/images/platform-operations-lead.webp',
  alt: 'An operations lead working at a desktop computer',
  tag: 'Handover in 4 weeks',
};

/** Orange call-to-action band above the footer. */
export const finalCta = {
  kicker: 'Two pilot slots open this quarter',
  title: 'Stop evaluating AI. Start operating it.',
  lead: 'Ninety minutes with your operations lead and one of our engineers. You leave with a scoped workflow, an honest feasibility call and a number.',
};

export const contactForm = {
  workflows: [
    'Customer support queue',
    'Back office and reconciliation',
    'Claims or document processing',
    'Revenue research and enrichment',
    'Something else entirely',
  ],
  submitLabel: 'Send enquiry',
  note: 'No sales sequence. One reply, written by an engineer.',
};

export const newsletter = {
  title: 'The run log, monthly',
  description: 'One email a month: what shipped, what broke, and the numbers behind it. No launch announcements.',
  submitLabel: 'Subscribe',
};
