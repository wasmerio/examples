import type { PricingPlan } from '../types';

export const pricing = {
  currency: '$',
  monthlyLabel: '/ month',
  yearlyLabel: '/ month, billed yearly',
  yearlySavings: 'save 15%',
};

// Demo prices only. CTAs point at the contact page — swap in your booking or checkout URL.
export const plans: PricingPlan[] = [
  {
    name: 'Essentials',
    description: 'For a steady, twice-a-week practice.',
    monthlyPrice: 89,
    yearlyPrice: 76,
    features: ['8 studio classes per month', 'Full on-demand video library', 'Book 7 days ahead', 'Free mat and towel rental'],
    ctaLabel: 'Choose Essentials',
    ctaUrl: '/contact',
  },
  {
    name: 'Unlimited',
    description: 'For daily movers and busy minds.',
    monthlyPrice: 139,
    yearlyPrice: 118,
    features: [
      'Unlimited studio classes',
      'Full on-demand video library',
      'Book 14 days ahead',
      '2 guest passes every month',
      '10% off workshops and retreats',
    ],
    featured: true,
    badge: 'Most chosen',
    ctaLabel: 'Choose Unlimited',
    ctaUrl: '/contact',
  },
  {
    name: 'Private',
    description: 'One-to-one coaching built around you.',
    monthlyPrice: 249,
    yearlyPrice: 212,
    features: ['4 private 60-minute sessions', 'Personal home practice plan', 'Unlimited group classes', 'Direct message with your coach'],
    ctaLabel: 'Choose Private',
    ctaUrl: '/contact',
  },
];
