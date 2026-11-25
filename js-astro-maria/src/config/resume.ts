import figma from '@/assets/logos/figma.svg';
import framer from '@/assets/logos/framer.svg';
import shopify from '@/assets/logos/shopify.svg';
import webflow from '@/assets/logos/webflow.svg';

export const resume = {
  eyebrow: 'Resume',
  title: '10+ years shaping digital products through UX, UI, and',
  highlight: 'systems thinking.',
  text: 'My work centres on product clarity: bringing structure to messy workflows, overloaded interfaces, and growing systems that need to scale without becoming harder to use.',
  snapshot: [
    { label: 'Location', value: 'Lisbon, Portugal' },
    { label: 'Focus', value: 'UX and product design' },
    { label: 'Specialties', value: 'Dashboards, workflows, design systems' },
    { label: 'Languages', value: 'English, Portuguese, Romanian' },
  ],
  experience: [
    {
      role: 'Lead Product Designer',
      company: 'Independent',
      period: '2021 - Present',
      text: 'Leading interface design, product strategy, and design systems work for SaaS and service platforms across legal, nonprofit, and property.',
    },
    {
      role: 'Senior Product Designer',
      company: 'Northbound Studio',
      period: '2017 - 2021',
      text: "Designed workflows, dashboards, and multi-platform products for startup and enterprise clients. Built the studio's shared component library.",
    },
    {
      role: 'UI/UX Designer',
      company: 'In-house product teams',
      period: '2014 - 2017',
      text: 'Built core interface patterns, user flows, and production-ready visual systems for web and mobile products.',
    },
  ],
  capabilities: [
    {
      title: 'Product strategy',
      text: 'Framing problems, prioritizing experience decisions, and aligning product goals with user value.',
    },
    {
      title: 'UI systems',
      text: 'Interface languages that scale across flows, features, and implementation teams.',
    },
    {
      title: 'Execution',
      text: 'Wireframes through high-fidelity UI, refinement, and developer-ready handoff.',
    },
  ],
  education: [
    { title: 'MA, Interaction Design', place: 'University of the Arts', period: '2014' },
    { title: 'BA, Visual Communication', place: 'National University of Arts', period: '2012' },
  ],
  tools: [
    { name: 'Figma', logo: figma, dark: false },
    { name: 'Framer', logo: framer, dark: true },
    { name: 'Webflow', logo: webflow, dark: false },
    { name: 'Shopify', logo: shopify, dark: false },
  ],
};
