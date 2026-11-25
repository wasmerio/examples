// ============================================
// SITE CONFIGURATION
// ============================================

export const siteConfig = {
  // ============================================
  // SITE METADATA & SEO
  // ============================================
  site: {
    name: 'AI Agent Platform',
    title: 'AI Agent Platform - Intelligent Automation for Modern Teams',
    description:
      'Transform your business with autonomous AI agents. Automate workflows, integrate seamlessly, and scale effortlessly. Start free today.',
    keywords:
      'AI agents, automation, workflow automation, AI platform, business automation',
    email: 'hello@aiagentplatform.com',

    // Open Graph / Twitter
    ogTitle: 'AI Agent Platform - Intelligent Automation',
    ogDescription:
      'Transform your business with autonomous AI agents that work 24/7',
    twitterCard: 'summary_large_image',
    twitterTitle: 'AI Agent Platform',
    twitterDescription: 'Intelligent automation for modern teams',
  },

  // ============================================
  // NAVIGATION
  // ============================================
  navigation: {
    links: [
      { name: 'Features', href: '#features' },
      { name: 'How It Works', href: '#how-it-works' },
      { name: 'Pricing', href: '#pricing' },
      { name: 'FAQ', href: '#faq' },
    ],
    cta: {
      text: 'Get Started',
      href: '#contact',
    },
  },

  // ============================================
  // HERO SECTION
  // ============================================
  hero: {
    headline: 'Intelligent AI Agents',
    subheadline: 'Built for Your Business',
    description:
      'Transform your workflow with autonomous AI agents that handle complex tasks, learn from your data, and deliver results 24/7. No coding required.',
    cta: {
      primary: {
        text: 'Get Started Free',
        href: '#contact',
      },
      secondary: {
        text: 'See How It Works',
        href: '#how-it-works',
      },
    },
    stats: [
      { value: '10k+', label: 'Active Agents' },
      { value: '99.9%', label: 'Uptime' },
      { value: '5M+', label: 'Tasks Automated' },
    ],
  },

  // ============================================
  // FEATURES SECTION
  // ============================================
  features: {
    title: 'Powerful Capabilities',
    subtitle:
      'Everything you need to build, deploy, and scale intelligent automation',
    items: [
      { icon: 'lightning', title: 'Autonomous Execution' },
      { icon: 'code', title: 'Smart Integration' },
      { icon: 'chart', title: 'Real-Time Analytics' },
      { icon: 'chat', title: 'Natural Language' },
      { icon: 'shield', title: 'Enterprise Security' },
      { icon: 'clock', title: '24/7 Operation' },
      { icon: 'brush', title: 'Custom Workflows' },
      { icon: 'layers', title: 'Multi-Agent Teams' },
      { icon: 'zap', title: 'Instant Scaling' },
    ],
  },

  // ============================================
  // HOW IT WORKS
  // ============================================
  howItWorks: {
    title: 'How It Works',
    subtitle: 'Get started in minutes with our simple 5-step process',
  },

  // ============================================
  // TESTIMONIALS
  // ============================================
  testimonials: {
    title: 'Loved by Teams Worldwide',
    subtitle: 'See what our customers have to say about AI Agent Platform',
    companyLogos: [
      'TECHFLOW',
      'INNOVATE',
      'DATASTREAM',
      'CLOUDSYNC',
      'NEXUSAI',
    ],
  },

  // ============================================
  // PRICING
  // ============================================
  pricing: {
    title: 'Simple, Transparent Pricing',
    subtitle:
      'Choose the plan that fits your needs. Upgrade or downgrade anytime.',
    plans: [
      {
        name: 'Free',
        price: '$0',
        period: '/month',
        description: 'Perfect for individuals and testing',
        features: [
          'Up to 3 agents',
          '1,000 tasks/month',
          'Basic integrations',
          'Email support',
        ],
        cta: {
          text: 'Get Started',
          href: '#contact',
        },
        featured: false,
      },
      {
        name: 'Pro',
        price: '$49',
        period: '/month',
        description: 'For growing teams and businesses',
        badge: 'MOST POPULAR',
        features: [
          'Unlimited agents',
          '50,000 tasks/month',
          'All integrations',
          'Priority support',
          'Advanced analytics',
          'Team collaboration',
        ],
        cta: {
          text: 'Start Free Trial',
          href: '#contact',
        },
        featured: true,
      },
      {
        name: 'Enterprise',
        price: 'Custom',
        period: '',
        description: 'For large-scale operations',
        features: [
          'Unlimited everything',
          'Custom integrations',
          'Dedicated support',
          'SLA guarantee',
          'On-premise option',
          'Custom training',
        ],
        cta: {
          text: 'Contact Sales',
          href: '#contact',
        },
        featured: false,
      },
    ],
  },

  // ============================================
  // FAQ
  // ============================================
  faq: {
    title: 'Frequently Asked Questions',
    subtitle: 'Everything you need to know about AI Agent Platform',
  },

  // ============================================
  // CONTACT
  // ============================================
  contact: {
    title: 'Start Building Today',
    subtitle:
      'Join thousands of teams using AI agents to automate their workflows. Get started in minutes with our free tier.',
    benefits: [
      'No credit card required',
      'Setup in under 5 minutes',
      'Cancel anytime',
      '24/7 customer support',
    ],
    email: 'hello@aiagentplatform.com',
    form: {
      cta: 'Get Started Free',
      fields: {
        name: {
          label: 'Full Name',
          placeholder: 'John Doe',
          required: true,
        },
        email: {
          label: 'Work Email',
          placeholder: 'john@company.com',
          required: true,
        },
        company: {
          label: 'Company',
          placeholder: 'Your Company Inc.',
          required: false,
        },
        message: {
          label: 'What would you like to automate?',
          placeholder: 'Tell us about your workflow and automation needs...',
          required: false,
        },
      },
    },
  },

  // ============================================
  // FOOTER
  // ============================================
  footer: {
    tagline:
      'Intelligent automation for modern teams. Transform your workflow with AI.',
    columns: [
      {
        title: 'Product',
        links: [
          { name: 'Features', href: '#features' },
          { name: 'Pricing', href: '#pricing' },
          { name: 'Integrations', href: '#' },
          { name: 'API Docs', href: '#' },
          { name: 'Changelog', href: '#' },
        ],
      },
      {
        title: 'Company',
        links: [
          { name: 'About Us', href: '#' },
          { name: 'Blog', href: '#' },
          { name: 'Careers', href: '#' },
          { name: 'Press Kit', href: '#' },
          { name: 'Contact', href: '#contact' },
        ],
      },
      {
        title: 'Legal',
        links: [
          { name: 'Privacy Policy', href: '#' },
          { name: 'Terms of Service', href: '#' },
          { name: 'Cookie Policy', href: '#' },
          { name: 'Security', href: '#' },
          { name: 'Compliance', href: '#' },
        ],
      },
    ],
    social: [
      { name: 'Twitter', href: '#', icon: 'twitter' },
      { name: 'GitHub', href: '#', icon: 'github' },
      { name: 'Dribbble', href: '#', icon: 'dribbble' },
      { name: 'LinkedIn', href: '#', icon: 'linkedin' },
    ],
    copyright: `${new Date().getFullYear()} AI Agent Platform. All rights reserved.`,
  },
};
