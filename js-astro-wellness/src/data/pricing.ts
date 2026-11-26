export interface Plan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted: boolean;
}

export const plans: Plan[] = [
  {
    name: 'Essentials',
    price: '29',
    period: 'per month',
    description: 'Everything you need to build a consistent training habit.',
    features: ['Open gym access (off-peak)', '2 group classes per week', 'Locker room & showers', 'Free trial class'],
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '49',
    period: 'per month',
    description: 'Our most popular plan for members who train four or more times a week.',
    features: [
      'Unlimited open gym access',
      'Unlimited group classes',
      '1 personal training session / month',
      'Recovery zone included',
      'Guest pass every month',
    ],
    highlighted: true,
  },
  {
    name: 'All Access',
    price: '79',
    period: 'per month',
    description: 'The full roster: coaching, nutrition, and recovery with zero limits.',
    features: [
      'Everything in Pro',
      '2 personal training sessions / month',
      'Nutrition coaching programme',
      'Monthly body composition scan',
      'Priority class booking',
    ],
    highlighted: false,
  },
];
