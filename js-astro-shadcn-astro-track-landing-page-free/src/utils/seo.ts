// SEO Utility Functions and Types
// Helper functions for SEO optimization across your Astro site

export interface SEOConfig {
  title: string
  description: string
  keywords?: string
  ogImage?: string
  type?: 'website' | 'article'
  author?: string
  twitterHandle?: string
  publishedTime?: string
  modifiedTime?: string
  locale?: string
  siteName?: string
}

export interface BreadcrumbItem {
  name: string
  url: string
}

/**
 * Generate structured data for breadcrumbs
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[], baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.url}`
    }))
  }
}

/**
 * Generate structured data for an article
 */
export function generateArticleSchema(
  title: string,
  description: string,
  publishedTime: string,
  modifiedTime: string,
  authorName: string,
  imageUrl: string,
  baseUrl: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    image: imageUrl,
    datePublished: publishedTime,
    dateModified: modifiedTime,
    author: {
      '@type': 'Person',
      name: authorName
    },
    publisher: {
      '@type': 'Organization',
      name: 'Your Organization Name',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`
      }
    }
  }
}

/**
 * Generate structured data for an organization
 */
export function generateOrganizationSchema(name: string, url: string, logo: string, socialLinks: string[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: name,
    url: url,
    logo: logo,
    sameAs: socialLinks
  }
}

/**
 * Generate structured data for FAQ
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }
}

/**
 * Truncate text to specified length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text

  return text.substring(0, maxLength - 3) + '...'
}

/**
 * Generate meta description from content
 */
export function generateMetaDescription(content: string, maxLength = 160): string {
  // Remove HTML tags
  const textOnly = content.replace(/<[^>]*>/g, '')

  // Remove extra whitespace
  const cleaned = textOnly.replace(/\s+/g, ' ').trim()

  return truncateText(cleaned, maxLength)
}

/**
 * Generate keywords from content
 */
export function extractKeywords(content: string, count = 10): string {
  // Remove HTML tags and special characters
  const textOnly = content.replace(/<[^>]*>/g, '').toLowerCase()
  const words = textOnly.split(/\s+/)

  // Common stop words to exclude
  const stopWords = new Set([
    'a',
    'an',
    'and',
    'are',
    'as',
    'at',
    'be',
    'by',
    'for',
    'from',
    'has',
    'he',
    'in',
    'is',
    'it',
    'its',
    'of',
    'on',
    'that',
    'the',
    'to',
    'was',
    'will',
    'with',
    'we',
    'you',
    'your'
  ])

  // Count word frequency
  const wordFreq = new Map<string, number>()

  words.forEach(word => {
    if (word.length > 3 && !stopWords.has(word)) {
      wordFreq.set(word, (wordFreq.get(word) || 0) + 1)
    }
  })

  // Sort by frequency and return top keywords
  const sortedWords = Array.from(wordFreq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([word]) => word)

  return sortedWords.join(', ')
}

/**
 * Validate SEO configuration
 */
export function validateSEO(config: SEOConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!config.title) {
    errors.push('Title is required')
  } else if (config.title.length > 60) {
    errors.push('Title should be 60 characters or less')
  } else if (config.title.length < 30) {
    errors.push('Title should be at least 30 characters for better SEO')
  }

  if (!config.description) {
    errors.push('Description is required')
  } else if (config.description.length > 160) {
    errors.push('Description should be 160 characters or less')
  } else if (config.description.length < 120) {
    errors.push('Description should be at least 120 characters for better SEO')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}
