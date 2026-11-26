export default {
  meta: {
    title: 'Pricing Plans — Find the Right Fit for Your Needs',
    description: 'Explore AstroRise pricing plans tailored for every stage of growth — from startups to enterprises. Compare features and choose the plan that empowers your next step.',
    robots: {
      index: true,
      follow: true,
    },
  },
  // translation for the blog page
  headline: 'Flexible Plans for Every Stage',
  sub_headline: 'Choose the right plan to build, grow, and scale your AstroRise-powered website.',
  pricing_plans: [
      {
      title: 'Starter',
      price: '$19',
      frequency: '/month',
      description: 'The essentials to provide your best work for clients.',
      features: ['5 products', 'Up to 1,000 subscribers', 'Basic analytics', '48-hour support response time'],
      popular: false,
      buttonVariant: 'border',
      url: '',
    },
    {
      title: 'Growth',
      price: '$29',
      frequency: '/month',
      description: 'A plan that scales with your rapidly growing business.',
      features: [
        '25 products',
        'Up to 10,000 subscribers',
        'Advanced analytics',
        '24-hour support response time',
        'Marketing automations',
      ],
      popular: true,
      buttonVariant: 'default',
      url: '',
    },
    {
      title: 'Enterprise',
      price: '$59',
      frequency: '/month',
      description: 'Dedicated support and infrastructure for your company.',
      features: [
        'Unlimited products',
        'Unlimited subscribers',
        'Advanced analytics',
        '1-hour, dedicated support response time',
        'Marketing automations',
        'Custom reporting tools',
      ],
      popular: false,
      buttonVariant: 'border',
      url: '',
    },
  ],
  pricing_table: {
    plans: [
      {
        name: 'Starter',
        url: 'https://example.com/pricing/starter',
      },
      {
        name: 'Growth',
        url: 'https://example.com/pricing/growth',
      },
      {
        name: 'Enterprise',
        url: 'https://example.com/pricing/scale',
      },
    ],
    categories: [
      {
      name: 'Features',
        items: [
          {
            name: 'Edge content delivery',
            values: ['✓', '✓', '✓'],
          },
          {
            name: 'Custom domains',
            values: ['1', '3', 'Unlimited'],
          },
          {
            name: 'Team members',
            values: ['3', '20', 'Unlimited'],
          },
          {
            name: 'Single sign-on (SSO)',
            values: ['-', '-', '✓'],
          },
        ],
      },
      {
        name: 'Reporting',
        items: [
          {
            name: 'Advanced analytics',
            values: ['✓', '✓', '✓'],
          },
          {
            name: 'Basic reports',
            values: ['✓', '✓', '✓'],
          },
          {
            name: 'Professional reports',
            values: ['-', '✓', '✓'],
          },
          {
            name: 'Custom report builder',
            values: ['-', '-', '✓'],
          },
        ],
      },
      {
      name: 'Support',
        items: [
          {
            name: '24/7 online support',
            values: ['✓', '✓', '✓'],
          },
          {
            name: 'Quarterly workshops',
            values: ['-', '✓', '✓'],
          },
          {
            name: 'Priority phone support',
            values: ['-', '-', '✓'],
          },
          {
            name: '1:1 onboarding tour',
            values: ['-', '-', '✓'],
          },
        ],
      },
    ],
  },
};
