import { getCollection, type CollectionEntry } from 'astro:content'

export type CaseStudyMetadata = {
  slug: string
  title?: string
  description?: string
  organisation?: string
  role?: string
  duration?: string
  tools?: string[]
  publishedAt?: string
  image?: string
  heroImage?: string
  logo?: string
}

export async function getAllCaseStudies(): Promise<CollectionEntry<'case-studies'>[]> {
  const caseStudies = await getCollection('case-studies')

  return caseStudies.sort((a, b) => new Date(b.data.publishedAt).valueOf() - new Date(a.data.publishedAt).valueOf())
}

export async function getCaseStudies(limit?: number): Promise<CaseStudyMetadata[]> {
  const caseStudies = await getAllCaseStudies()
  const metadata = caseStudies.map(entry => entry.data)

  return limit ? metadata.slice(0, limit) : metadata
}

export async function getCaseStudyBySlug(slug: string): Promise<CollectionEntry<'case-studies'> | null> {
  const caseStudies = await getAllCaseStudies()

  return caseStudies.find(entry => entry.data.slug === slug) ?? null
}
