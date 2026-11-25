// Site Configuration
// Centralized configuration for site metadata, SEO, and branding

export const SITE_TITLE = 'Zolt - Portfolio Landing page'
export const SITE_DESCRIPTION =
  'Zolt is a free modern Shadcn UI Portfolio Template built with Astro for designers, developers, freelancers, and agencies to create fast, responsive, and SEO-friendly portfolio websites.'

export const GITHUB_URL = 'https://github.com/yourusername/zolt-portfolio'
export const SITE_URL = 'https://shadcnstudio.com/'

export const SITE_METADATA = {
  title: {
    template: '%s - Zolt',
    default: 'Zolt - Portfolio Landing page'
  },
  description: SITE_DESCRIPTION,
  keywords: ['portfolio template', 'astro template', 'shadcn ui', 'design engineer', 'freelancer portfolio'],
  authors: [{ name: 'Zolt Mercer', url: SITE_URL }],
  creator: 'Zolt Mercer',
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
    siteName: 'Zolt',
    title: 'Zolt - Portfolio Landing page',
    description: SITE_DESCRIPTION,
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Zolt - Portfolio Landing page',
        type: 'image/png'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    site: '@shadcnstudio',
    creator: '@shadcnstudio',
    title: 'Zolt - Portfolio Landing page',
    description: SITE_DESCRIPTION,
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
  github: 'https://github.com/yourusername',
  linkedin: 'https://linkedin.com/in/yourusername',
  instagram: 'https://instagram.com/yourusername',
  twitter: 'https://twitter.com/yourusername'
}

// Company information for structured data
export const COMPANY_INFO = {
  name: 'Zolt Mercer',
  legalName: 'Zolt Mercer',
  url: SITE_URL,
  logo: `/images/site-logo.png`,
  foundingDate: '2024',
  address: {
    streetAddress: '',
    addressLocality: 'Austin',
    addressRegion: 'TX',
    postalCode: '',
    addressCountry: 'US'
  },
  contactPoint: {
    telephone: '',
    contactType: 'customer support',
    email: 'hello@zoltmercer.com'
  },
  sameAs: Object.values(SOCIAL_LINKS)
}
