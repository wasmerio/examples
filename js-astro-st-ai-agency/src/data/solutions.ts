import type { Solution } from '../types';

export const solutions: Solution[] = [
  {
    number: '01',
    title: 'Customer support',
    description:
      'Tier-1 resolution across email, chat and voice, grounded in your real help centre. Refuses anything outside scope and writes a clean handoff packet when a person is needed.',
    image: '/images/solution-support.webp',
    href: '/#contact',
    category: 'Support',
  },
  {
    number: '02',
    title: 'Back office & finance',
    description:
      "Invoice reconciliation, onboarding checks, refunds and renewals. The repeat work that quietly eats a third of your team's week, done overnight with an audit trail.",
    image: '/images/solution-finance.webp',
    href: '/#contact',
    category: 'Operations',
  },
  {
    number: '03',
    title: 'Documents & claims',
    description:
      'Extract, verify against policy, file. Built for the messy PDF, the scanned fax and the supplier who redesigns their invoice every quarter.',
    image: '/images/solution-documents.webp',
    href: '/#contact',
    category: 'Documents',
  },
  {
    number: '04',
    title: 'Revenue research',
    description:
      "Enrich inbound leads, read the account's public footprint, and hand the rep a two-paragraph brief before the call — sourced, dated and linked.",
    image: '/images/solution-research.webp',
    href: '/#contact',
    category: 'Sales',
  },
  {
    number: '05',
    title: 'Evaluation & supervision',
    description:
      'The part most agencies skip. Labelled test sets, regression runs on every prompt change, and an alert the day quality starts to slip.',
    image: '/images/solution-evaluation.webp',
    href: '/#contact',
    category: 'Quality',
  },
];
