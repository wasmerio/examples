import type { Customer } from '../types';

/** Fictional demo case studies. Replace with your own results. */
export const customers: Customer[] = [
  {
    company: 'Meridian',
    title: 'Meridian — dispute triage',
    sector: 'Banking',
    description:
      'A card-dispute queue running nine days behind. The intake agent reads the claim, pulls the transaction trail and drafts the regulator-ready summary for an analyst to approve.',
    image: '/images/customer-fintech.webp',
    imageAlt: 'A hand holding out a payment card',
    metrics: [
      { value: '9d → 4h', label: 'Queue age' },
      { value: '71%', label: 'Straight through' },
    ],
    featured: true,
  },
  {
    company: 'Kestrel Health',
    title: 'Kestrel — prior authorisation',
    sector: 'Healthcare',
    description:
      'Twelve staff assembling authorisation packets by hand. The agent gathers the clinical evidence, checks it against payer rules, and stops dead on anything ambiguous.',
    image: '/images/customer-healthcare.webp',
    imageAlt: 'A clinician in a white coat reviewing notes on a clipboard',
    metrics: [
      { value: '3.1×', label: 'Packets per day' },
      { value: '0', label: 'Unreviewed sends' },
    ],
  },
  {
    company: 'Northwind Freight',
    title: 'Northwind — exception desk',
    sector: 'Logistics',
    description:
      'Every delayed load used to generate four emails and a phone call. The agent chases the carrier, updates the customer, and wakes a coordinator only when the ETA slips twice.',
    image: '/images/customer-logistics.webp',
    imageAlt: 'A forklift loading boxed freight at a warehouse dock',
    metrics: [
      { value: '4,200h', label: 'Saved per year' },
      { value: '−38%', label: 'Inbound calls' },
    ],
  },
];
