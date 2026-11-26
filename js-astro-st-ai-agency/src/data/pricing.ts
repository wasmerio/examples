import type { PricingPlan } from '../types';

export const pricingPlans: PricingPlan[] = [
  {
    name: 'Pilot',
    price: '$8,400',
    billing: '/ month',
    description:
      'One agent, one workflow, six weeks. Ends with a go or no-go backed by a labelled evaluation rather than a slide.',
    features: [
      'On-site process mapping workshop',
      'One production agent, sandboxed',
      '200-case labelled test set',
      'Baseline ROI model you keep',
      'Business-hours support',
    ],
    cta: { label: 'Start a pilot', href: '/#contact' },
  },
  {
    name: 'Scale',
    price: '$21,000',
    billing: '/ month',
    description:
      'Up to four agents in production with shared on-call, nightly evaluation runs and a monthly operating review with your leadership.',
    features: [
      'Everything in Pilot, across four workflows',
      'Shared 24/7 on-call rotation',
      'Nightly regression and drift alerts',
      'Custom connectors at no extra cost',
      'Security review and penetration test',
      'Team training and full handover',
    ],
    highlighted: true,
    badge: 'Most engagements',
    cta: { label: 'Book a demo', href: '/#contact' },
  },
  {
    name: 'Embedded',
    price: 'Custom',
    description:
      'For regulated environments, private deployments and programmes running more than six agents across multiple business units.',
    features: [
      'Deployed in your cloud or on premise',
      'Named engineers embedded with your team',
      'Models fixed to your compliance list',
      'Audit pack for your regulator',
      'SLA with financial remedies',
    ],
    cta: { label: 'Talk to us', href: '/#contact' },
  },
];
