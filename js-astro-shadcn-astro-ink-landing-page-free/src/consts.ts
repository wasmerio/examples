// Site Configuration
// Centralized configuration for site metadata, SEO, and branding

export const SITE_TITLE = 'Demo: Ink - Blog Landing Page | Shadcn Studio'
export const SITE_DESCRIPTION =
  'Ink is a free Shadcn UI Blog Landing Page template to publish articles, insights, and categories with a clean, fast, and readable layout.'

export const GITHUB_URL = 'https://github.com/yourusername/master-shadcn-astro'
export const SITE_URL = 'https://shadcnstudio.com/'

export const SITE_METADATA = {
  title: {
    default: 'Demo: Ink - Blog Landing Page | Shadcn Studio'
  },
  description:
    'Ink is a free Shadcn UI Blog Landing Page template to publish articles, insights, and categories with a clean, fast, and readable layout.',
  keywords: [
    'Astro',
    'astro template',
    'astro theme',
    'astro starter',
    'shadcn template',
    'shadcn ui',
    'shadcn/ui components',
    'tailwind template',
    'tailwind css',
    'react components',
    'SEO optimized',
    'web development',
    'static site generator',
    'modern web apps',
    'performance',
    'typescript'
  ],
  authors: [{ name: 'shadcn Studio', url: SITE_URL }],
  creator: 'shadcn Studio',
  publisher: 'shadcn Studio',
  robots: {
    index: true,
    follow: true
  },
  language: 'en-US',
  locale: 'en_US',
  icons: {
    icon: [
      { url: '/favicon/favicon.ico', sizes: '48x48' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }
    ],
    apple: [{ url: '/favicon/apple-touch-icon.png', sizes: '180x180' }],
    shortcut: [{ url: '/favicon/favicon.ico' }]
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Ink',
    title: 'Ink - Blog Landing Page | Shadcn Studio',
    description:
      'Ink is a free Shadcn UI Blog Landing Page template to publish articles, insights, and categories with a clean, fast, and readable layout.',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Ink - Blog Landing Page',
        type: 'image/png'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    site: '@shadcnstudio',
    creator: '@shadcnstudio',
    title: 'Ink - Blog Landing Page | Shadcn Studio',
    description:
      'Ink is a free Shadcn UI Blog Landing Page template to publish articles, insights, and categories with a clean, fast, and readable layout.',
    images: ['/images/og-image.png']
  },
  verification: {
    google: '', // Add your Google verification code
    yandex: '', // Add your Yandex verification code
    bing: '' // Add your Bing verification code
  }
}

// Social media links
export const SOCIAL_LINKS = {
  github: GITHUB_URL,
  twitter: 'https://twitter.com/shadcnstudio',
  linkedin: 'https://linkedin.com/company/shadcnstudio',
  discord: 'https://discord.gg/shadcnstudio'
}

// Company information for structured data
export const COMPANY_INFO = {
  name: 'Ink',
  legalName: 'shadcn Studio Inc.',
  url: SITE_URL,
  logo: `/images/site-logo.png`,
  foundingDate: '2024',
  address: {
    streetAddress: '123 Web Dev Street',
    addressLocality: 'San Francisco',
    addressRegion: 'CA',
    postalCode: '94102',
    addressCountry: 'US'
  },
  contactPoint: {
    telephone: '+1-555-123-4567',
    contactType: 'customer support',
    email: 'support@shadcnstudio.com'
  },
  sameAs: Object.values(SOCIAL_LINKS)
}
