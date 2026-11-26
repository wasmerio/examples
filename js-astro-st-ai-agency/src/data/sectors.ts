import type { Sector } from '../types';

export const sectors: Sector[] = [
  {
    title: 'Banking & fintech',
    description: 'Reconciliation, KYC review queues, dispute triage with a full audit trail.',
    image: '/images/sector-banking.webp',
    imageAlt: 'A laptop showing financial charts and a pie chart',
    workflows: ['Reconciliation', 'KYC review', 'Dispute triage'],
  },
  {
    title: 'Healthcare ops',
    description: 'Prior authorisation packets, referral routing, coding support with clinician sign-off.',
    image: '/images/sector-healthcare.webp',
    imageAlt: 'A nurse kneeling beside a patient in a wheelchair in a hospital corridor',
    workflows: ['Prior authorisation', 'Referral routing', 'Coding support'],
  },
  {
    title: 'Freight & supply chain',
    description: 'Exception handling, carrier chasing, proof-of-delivery matching at volume.',
    image: '/images/sector-freight.webp',
    imageAlt: 'Stacks of shipping containers in a port yard',
    workflows: ['Exception handling', 'Carrier chasing', 'Proof of delivery'],
  },
  {
    title: 'Software support',
    description: 'Tier-1 deflection, bug triage, release notes drafted from the changelog.',
    image: '/images/sector-software.webp',
    imageAlt: 'Source code on a laptop screen',
    workflows: ['Tier-1 deflection', 'Bug triage', 'Release notes'],
  },
  {
    title: 'Claims & underwriting',
    description: 'First-notice-of-loss intake, document verification, straight-through settlement.',
    image: '/images/sector-insurance.webp',
    imageAlt: 'A person signing a printed contract',
    workflows: ['FNOL intake', 'Document verification', 'Settlement'],
  },
  {
    title: 'Commerce ops',
    description: 'Catalogue enrichment, returns triage, supplier email handled in six languages.',
    image: '/images/sector-commerce.webp',
    imageAlt: 'A shopping trolley in front of stocked supermarket shelves',
    workflows: ['Catalogue enrichment', 'Returns triage', 'Supplier email'],
  },
];
