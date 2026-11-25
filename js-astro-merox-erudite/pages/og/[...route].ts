import { OGImageRoute } from 'astro-og-canvas'

// Content pages (blog posts, etc.)
const contentPages = import.meta.glob('/src/content/**/*.{md,mdx}', { eager: true })
const contentPagesMap = Object.entries(contentPages).reduce((acc, [path, page]) => {
  const newPath = path.replace('/src/content', '')
  return { ...acc, [newPath]: page }
}, {})

// Tools pages mapping
const toolsPages: Record<string, { frontmatter: { title: string; description: string } }> = {
  '/tools': {
    frontmatter: {
      title: 'Free Online Tools',
      description: 'Free online tools for system administrators, developers, and IT professionals. Password generator, subnet calculator, IP lookup, DNS lookup, and Base64 encoder.',
    },
  },
  '/tools/password-generator': {
    frontmatter: {
      title: 'Password Generator',
      description: 'Free online password generator and strength checker. Generate secure, random passwords with customizable options. Check password strength instantly.',
    },
  },
  '/tools/subnet-calculator': {
    frontmatter: {
      title: 'Subnet Calculator',
      description: 'Free online subnet calculator for network administrators. Calculate subnet masks, network addresses, broadcast addresses, and usable IP ranges.',
    },
  },
  '/tools/ip-dns-lookup': {
    frontmatter: {
      title: 'IP & DNS Lookup',
      description: 'Free online IP address geolocation and DNS lookup tool. Lookup IP location, ISP information, and DNS records for any domain or IP address.',
    },
  },
  '/tools/ssl-checker': {
    frontmatter: {
      title: 'SSL Certificate Checker',
      description: 'Free online SSL certificate checker tool. Check SSL certificate validity, expiration dates, issuer information, and certificate details for any website.',
    },
  },
}

// Merge content pages and tools pages
const allPages = { ...contentPagesMap, ...toolsPages }

export const { getStaticPaths, GET } = OGImageRoute({
  param: 'route',
  pages: allPages,
  getImageOptions: (_path, page) => ({
    title: page.frontmatter.title || page.frontmatter.name || '',
    description: page.frontmatter.description || '',
    logo: {
      path: './public/static/logo.png',
      size: [80, 80],
    },
    font: {
      title: {
        families: ['Geist Mono'],
        weight: 'Bold',
        size: 48, // Redus de la 60
        color: [255, 255, 255],
      },
      description: {
        families: ['Geist Mono'],
        weight: 'Normal',
        size: 28, // Redus de la 36
        color: [156, 163, 175],
      },
    },
    fonts: ['./public/fonts/GeistMonoVF.woff2'],
    bgGradient: [[24, 24, 27]],
    padding: 80,
  }),
})