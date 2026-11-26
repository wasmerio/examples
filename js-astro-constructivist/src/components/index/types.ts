export type IndexGroup = 'sections' | 'cases' | 'skills' | 'links'

export interface IndexEntry {
  group: IndexGroup
  label: string
  meta: string
  href: string
  external?: boolean
  search: string
}
